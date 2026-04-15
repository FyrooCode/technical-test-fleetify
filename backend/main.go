package main

import (
	"fmt"
	"log"
	"os"
	"technical-test-fleetify/backend/models"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func initDatabase() {
	var err error
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable",
		os.Getenv("DB_HOST"), os.Getenv("DB_USER"), os.Getenv("DB_PASSWORD"), os.Getenv("DB_NAME"), os.Getenv("DB_PORT"))

	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	DB.AutoMigrate(&models.Item{}, &models.Invoice{}, &models.InvoiceDetail{})

	seedItems()
}

func seedItems() {
	var count int64
	DB.Model(&models.Item{}).Count(&count)
	if count == 0 {
		items := []models.Item{
			{Code: "Tire-001", Name: "Ban Gajah Tunggal 10.00-20", Price: 2500000},
			{Code: "Oil-001", Name: "Oli Mesin Meditran S 10L", Price: 850000},
			{Code: "Brk-002", Name: "Kampas Rem Hino500", Price: 1200000},
			{Code: "Fltr-001", Name: "Filter Solar Sakura", Price: 150000},
		}
		DB.Create(&items)
		log.Println("Seeding Master Items completed.")
	}
}

func main() {
	initDatabase()

	app := fiber.New()
	app.Use(cors.New())

	app.Get("/api/items", func(c *fiber.Ctx) error {
		var items []models.Item
		DB.Find(&items)
		return c.JSON(items)
	})

	log.Fatal(app.Listen(":8080"))
}
