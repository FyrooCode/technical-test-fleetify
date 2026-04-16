package invoice

import (
	"bytes"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"technical-test-fleetify/backend/internal/database"
	"technical-test-fleetify/backend/internal/item"
	"time"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

type CreateInvoiceResponse struct {
	Status string  `json:"status"`
	Data   Invoice `json:"data"`
	Meta   struct {
		Timestamp time.Time `json:"timestamp"`
	} `json:"meta"`
}

func sendWebhook(data interface{}) {
	webhookURL := os.Getenv("WEBHOOK_URL")

	log.Printf("[Webhook DEBUG] Starting sendWebhook, URL: %s", webhookURL)

	if webhookURL == "" {
		log.Println("[Webhook] Skipped - WEBHOOK_URL not set")
		return
	}

	jsonData, err := json.Marshal(data)
	if err != nil {
		log.Printf("[Webhook] Failed to marshal data: %v", err)
		return
	}

	log.Printf("[Webhook DEBUG] Payload size: %d bytes", len(jsonData))

	client := &http.Client{
		Timeout: 10 * time.Second,
	}

	log.Printf("[Webhook DEBUG] Sending POST request to: %s", webhookURL)
	resp, err := client.Post(webhookURL, "application/json", bytes.NewBuffer(jsonData))
	if err != nil {
		log.Printf("[Webhook] ❌ FAILED - Error: %v", err)
		return
	}
	defer resp.Body.Close()

	log.Printf("[Webhook DEBUG] Response Status: %d", resp.StatusCode)

	if resp.StatusCode >= 400 {
		log.Printf("[Webhook] ❌ Server error: %d", resp.StatusCode)
	} else {
		log.Printf("[Webhook] ✅ SUCCESS - Webhook sent to %s (Status: %d)", webhookURL, resp.StatusCode)
	}
}

func CreateInvoiceHandler(c *fiber.Ctx) error {
	type DetailReq struct {
		ItemID   uint `json:"item_id"`
		Quantity int  `json:"quantity"`
	}

	type InvoiceReq struct {
		SenderName      string      `json:"sender_name"`
		SenderAddress   string      `json:"sender_address"`
		ReceiverName    string      `json:"receiver_name"`
		ReceiverAddress string      `json:"receiver_address"`
		Details         []DetailReq `json:"details"`
	}

	var req InvoiceReq
	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{
			"status": "error",
			"error": fiber.Map{
				"code":    "INVALID_REQUEST",
				"message": "Invalid request format",
			},
		})
	}

	if len(req.Details) == 0 {
		return c.Status(400).JSON(fiber.Map{
			"status": "error",
			"error": fiber.Map{
				"code":    "MISSING_FIELD",
				"message": "details array required (min 1 item)",
			},
		})
	}

	username := c.Locals("username").(string)
	var userID uint
	if username == "admin" {
		userID = 1
	} else {
		userID = 2
	}

	var createdInvoice Invoice
	err := database.DB.Transaction(func(tx *gorm.DB) error {
		now := time.Now()
		datePrefix := fmt.Sprintf("INV/%04d/%02d", now.Year(), now.Month())
		var count int64
		tx.Model(&Invoice{}).Where("invoice_number LIKE ?", datePrefix+"%").Count(&count)
		invoiceNumber := fmt.Sprintf("%s/%03d", datePrefix, count+1)

		var totalAmount int64
		var invoiceDetails []InvoiceDetail

		for _, d := range req.Details {
			var masterItem item.Item
			if err := tx.First(&masterItem, d.ItemID).Error; err != nil {
				return fiber.NewError(404, "Item not found")
			}

			if d.Quantity <= 0 {
				return fiber.NewError(400, "Quantity must be > 0")
			}

			subtotal := masterItem.Price * int64(d.Quantity)
			totalAmount += subtotal

			invoiceDetails = append(invoiceDetails, InvoiceDetail{
				ItemID:   masterItem.ID,
				Quantity: d.Quantity,
				Price:    masterItem.Price,
				Subtotal: subtotal,
			})
		}

		newInvoice := Invoice{
			InvoiceNumber:   invoiceNumber,
			SenderName:      req.SenderName,
			SenderAddress:   req.SenderAddress,
			ReceiverName:    req.ReceiverName,
			ReceiverAddress: req.ReceiverAddress,
			TotalAmount:     totalAmount,
			CreatedBy:       userID,
			CreatedAt:       time.Now(),
			Details:         invoiceDetails,
		}

		if err := tx.Create(&newInvoice).Error; err != nil {
			return err
		}

		return tx.Preload("Details.Item").First(&createdInvoice, newInvoice.ID).Error
	})

	if err != nil {
		if e, ok := err.(*fiber.Error); ok {
			return c.Status(e.Code).JSON(fiber.Map{
				"status": "error",
				"error": fiber.Map{
					"code":    "VALIDATION_FAILED",
					"message": e.Message,
				},
			})
		}
		return c.Status(500).JSON(fiber.Map{
			"status": "error",
			"error": fiber.Map{
				"code":    "DATABASE_ERROR",
				"message": "Failed to create invoice",
			},
		})
	}

	go sendWebhook(createdInvoice)

	resp := CreateInvoiceResponse{
		Status: "success",
		Data:   createdInvoice,
	}
	resp.Meta.Timestamp = time.Now()

	return c.Status(201).JSON(resp)
}

func GetInvoicesHandler(c *fiber.Ctx) error {
	var invoices []Invoice

	username := c.Locals("username").(string)
	var userID uint
	if username == "admin" {
		userID = 1
	} else {
		userID = 2
	}

	query := database.DB
	if username != "admin" {
		query = query.Where("created_by = ?", userID)
	}

	if err := query.Preload("Details.Item").Order("created_at DESC").Find(&invoices).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{
			"status": "error",
			"error": fiber.Map{
				"code":    "DATABASE_ERROR",
				"message": "Failed to fetch invoices",
			},
		})
	}

	return c.Status(200).JSON(fiber.Map{
		"status": "success",
		"data":   invoices,
		"meta": fiber.Map{
			"timestamp": time.Now(),
		},
	})
}
