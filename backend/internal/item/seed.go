package item

import (
	"log"
	"technical-test-fleetify/backend/internal/database"
)

func SeedItems() {
	var count int64
	database.DB.Model(&Item{}).Count(&count)

	if count == 0 {
		items := []Item{
			{Code: "Tire-001", Name: "Ban Gajah Tunggal 10.00-20", Price: 2500000},
			{Code: "Oil-001", Name: "Oli Mesin Meditran S 10L", Price: 850000},
			{Code: "Brk-002", Name: "Kampas Rem Hino500", Price: 1200000},
			{Code: "Fltr-001", Name: "Filter Solar Sakura", Price: 150000},
		}

		if err := database.DB.Create(&items).Error; err != nil {
			log.Printf("Could not seed items: %v", err)
		} else {
			log.Println("Seeding Master Items completed.")
		}
	}
}
