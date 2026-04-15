package models

import (
	"time"
)

// Master Data Item
type Item struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	Code      string    `gorm:"unique;not null" json:"code"`
	Name      string    `gorm:"not null" json:"name"`
	Price     float64   `gorm:"not null" json:"price"`
	CreatedAt time.Time `json:"created_at"`
}

// Header Invoice
type Invoice struct {
	ID              uint            `gorm:"primaryKey" json:"id"`
	InvoiceNumber   string          `gorm:"unique;not null" json:"invoice_number"`
	SenderName      string          `gorm:"not null" json:"sender_name"`
	SenderAddress   string          `gorm:"type:text;not null" json:"sender_address"`
	ReceiverName    string          `gorm:"not null" json:"receiver_name"`
	ReceiverAddress string          `gorm:"type:text;not null" json:"receiver_address"`
	TotalAmount     float64         `gorm:"not null" json:"total_amount"`
	CreatedBy       string          `gorm:"not null" json:"created_by"`
	CreatedAt       time.Time       `json:"created_at"`
	Details         []InvoiceDetail `gorm:"foreignKey:InvoiceID" json:"details"`
}

// Detail Invoice
type InvoiceDetail struct {
	ID        uint    `gorm:"primaryKey" json:"id"`
	InvoiceID uint    `gorm:"not null" json:"invoice_id"`
	ItemID    uint    `gorm:"not null" json:"item_id"`
	Quantity  int     `gorm:"not null" json:"quantity"`
	Price     float64 `gorm:"not null" json:"price"`
	Subtotal  float64 `gorm:"not null" json:"subtotal"`
}
