package db

import (
	"api/entity"
	"fmt"

	"gorm.io/gorm"
)

func RunMigrations(db *gorm.DB) error {
	// Auto migrate all entities
	if err := db.AutoMigrate(&entity.User{}); err != nil {
		return fmt.Errorf("failed to migrate User: %w", err)
	}

	if err := db.AutoMigrate(&entity.Category{}); err != nil {
		return fmt.Errorf("failed to migrate Category: %w", err)
	}

	if err := db.AutoMigrate(&entity.Location{}); err != nil {
		return fmt.Errorf("failed to migrate Location: %w", err)
	}

	if err := db.AutoMigrate(&entity.Review{}); err != nil {
		return fmt.Errorf("failed to migrate Review: %w", err)
	}

	// Seed initial data if not exist
	seedCategories(db)
	SeedLocations(db)

	return nil
}

func seedCategories(db *gorm.DB) {
	categories := []entity.Category{
		{Name: "wisata"},
		{Name: "health"},
		{Name: "hotel"},
		{Name: "restoran"},
		{Name: "pura"},
	}

	for _, cat := range categories {
		var count int64
		db.Model(&entity.Category{}).Where("name = ?", cat.Name).Count(&count)
		if count == 0 {
			db.Create(&cat)
		}
	}
}
