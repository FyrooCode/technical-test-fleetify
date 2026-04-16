package invoice

import (
	"technical-test-fleetify/backend/internal/item"
	"time"
)

type Invoice struct {
	ID              uint            `gorm:"primaryKey" json:"id"`
	InvoiceNumber   string          `gorm:"unique;not null" json:"invoice_number"`
	SenderName      string          `gorm:"not null" json:"sender_name"`
	SenderAddress   string          `gorm:"type:text;not null" json:"sender_address"`
	ReceiverName    string          `gorm:"not null" json:"receiver_name"`
	ReceiverAddress string          `gorm:"type:text;not null" json:"receiver_address"`
	TotalAmount     int64           `gorm:"not null" json:"total_amount"`
	CreatedBy       uint            `gorm:"not null" json:"created_by"`
	CreatedAt       time.Time       `json:"created_at"`
	Details         []InvoiceDetail `gorm:"foreignKey:InvoiceID" json:"details"`
}

type InvoiceDetail struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	InvoiceID uint      `gorm:"not null" json:"invoice_id"`
	ItemID    uint      `gorm:"not null" json:"item_id"`
	Item      item.Item `gorm:"foreignKey:ItemID" json:"item"`
	Quantity  int       `gorm:"not null" json:"quantity"`
	Price     int64     `gorm:"not null" json:"price"`
	Subtotal  int64     `gorm:"not null" json:"subtotal"`
}
