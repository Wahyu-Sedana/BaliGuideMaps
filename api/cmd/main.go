package main

import (
	"api/config"
	"api/db"
	"api/router"
	"fmt"
	"log"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

func main() {
	// Load configuration
	cfg, err := config.LoadConfig()
	if err != nil {
		log.Fatalf("Failed to load config: %v", err)
	}

	// Initialize database
	dsn := config.GetDSN(cfg)
	database, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	log.Println("✓ Database connected successfully")

	// Run migrations
	if err := db.RunMigrations(database); err != nil {
		log.Fatalf("Failed to run migrations: %v", err)
	}

	log.Println("✓ Migrations completed successfully")

	// Setup router
	gin := router.SetupRouter(database, cfg)

	log.Println("✓ Router setup completed")

	// Start server
	address := fmt.Sprintf(":%s", cfg.AppPort)
	log.Printf("🚀 Server starting on %s\n", address)

	if err := gin.Run(address); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
