package main

import (
	"log"
	"technical-test-fleetify/backend/internal/database"
	"technical-test-fleetify/backend/internal/invoice"
	"technical-test-fleetify/backend/internal/item"
	"technical-test-fleetify/backend/internal/routes"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
)

func main() {
	// 1. Inisialisasi Koneksi Database
	database.InitDB()

	// 2. Jalankan Auto Migration
	// GORM akan membuat/update tabel berdasarkan model yang kita buat
	err := database.DB.AutoMigrate(
		&item.Item{},
		&invoice.Invoice{},
		&invoice.InvoiceDetail{},
	)
	if err != nil {
		log.Fatalf("Migration failed: %v", err)
	}

	// 3. Jalankan Seeder untuk Master Data Items
	item.SeedItems()

	// 4. Inisialisasi Fiber App
	app := fiber.New()

	// 5. Global Middleware
	app.Use(cors.New())   // Izinkan akses dari Frontend (Next.js)
	app.Use(logger.New()) // Log setiap request yang masuk ke terminal

	// 6. Daftarkan Semua Route
	routes.SetupRoutes(app)

	// 7. Start Server pada port 8080
	log.Fatal(app.Listen(":8080"))
}
