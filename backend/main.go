package main

import (
	"log"
	"technical-test-fleetify/backend/internal/database"
	"technical-test-fleetify/backend/internal/invoice"
	"technical-test-fleetify/backend/internal/item"
	"technical-test-fleetify/backend/internal/routes"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func main() {
	database.InitDB()

	err := database.DB.AutoMigrate(
		&item.Item{},
		&invoice.Invoice{},
		&invoice.InvoiceDetail{},
	)
	if err != nil {
		log.Fatalf("Migration failed: %v", err)
	}

	item.SeedItems()

	app := fiber.New()

	app.Use(cors.New())

	routes.SetupRoutes(app)

	log.Fatal(app.Listen(":8080"))
}
