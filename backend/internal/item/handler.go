package item

import (
	"time"

	"technical-test-fleetify/backend/internal/database"

	"github.com/gofiber/fiber/v2"
)

type ItemResponseData struct {
	Status string `json:"status"`
	Data   []Item `json:"data"`
	Meta   struct {
		TotalResults int       `json:"total_results"`
		Timestamp    time.Time `json:"timestamp"`
	} `json:"meta"`
}

type ItemErrorResponse struct {
	Status string `json:"status"`
	Error  struct {
		Code    string `json:"code"`
		Message string `json:"message"`
	} `json:"error"`
}

func GetItemsHandler(c *fiber.Ctx) error {
	var items []Item

	searchCode := c.Query("code", "")

	query := database.DB
	if searchCode != "" {
		query = query.Where("code ILIKE ?", "%"+searchCode+"%")
	}

	if err := query.Find(&items).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{
			"status": "error",
			"error": fiber.Map{
				"code":    "DATABASE_ERROR",
				"message": "Failed to fetch items from database",
			},
		})
	}

	if items == nil {
		items = []Item{}
	}

	resp := ItemResponseData{
		Status: "success",
		Data:   items,
	}
	resp.Meta.TotalResults = len(items)
	resp.Meta.Timestamp = time.Now()

	return c.JSON(resp)
}
