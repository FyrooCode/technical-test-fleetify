package routes

import (
	"technical-test-fleetify/backend/internal/auth"
	"technical-test-fleetify/backend/internal/invoice"
	"technical-test-fleetify/backend/internal/item"
	"technical-test-fleetify/backend/middleware"

	"github.com/gofiber/fiber/v2"
)

func SetupRoutes(app *fiber.App) {
	// Root API Group
	api := app.Group("/api")

	//Public routes
	api.Post("/login", auth.LoginHandler)
	api.Get("/items", item.GetItemsHandler)

	//Protected routes
	protected := api.Group("/", middleware.JWTProtected)
	protected.Post("/invoices", invoice.CreateInvoiceHandler)
	protected.Get("/invoices", invoice.GetInvoicesHandler)
}
