package config

import (
	"fmt"
	"os"
	"time"

	"github.com/joho/godotenv"
)

type Config struct {
	AppName          string
	AppPort          string
	AppEnv           string
	DBHost           string
	DBPort           string
	DBUser           string
	DBPassword       string
	DBName           string
	JWTSecret        string
	JWTExpiration    time.Duration
	CORSAllowOrigins string
}

var AppConfig *Config

func LoadConfig() (*Config, error) {
	// Load .env file
	_ = godotenv.Load()

	jwtExp := os.Getenv("JWT_EXPIRATION")
	if jwtExp == "" {
		jwtExp = "24h"
	}

	duration, err := time.ParseDuration(jwtExp)
	if err != nil {
		duration = 24 * time.Hour
	}

	config := &Config{
		AppName:          os.Getenv("APP_NAME"),
		AppPort:          os.Getenv("APP_PORT"),
		AppEnv:           os.Getenv("APP_ENV"),
		DBHost:           os.Getenv("DB_HOST"),
		DBPort:           os.Getenv("DB_PORT"),
		DBUser:           os.Getenv("DB_USER"),
		DBPassword:       os.Getenv("DB_PASSWORD"),
		DBName:           os.Getenv("DB_NAME"),
		JWTSecret:        os.Getenv("JWT_SECRET"),
		JWTExpiration:    duration,
		CORSAllowOrigins: os.Getenv("CORS_ALLOW_ORIGINS"),
	}

	// Validate required config
	if config.DBHost == "" {
		config.DBHost = "localhost"
	}
	if config.DBPort == "" {
		config.DBPort = "3306"
	}
	if config.AppPort == "" {
		config.AppPort = "8080"
	}
	if config.JWTSecret == "" {
		config.JWTSecret = "default-secret-key" // CHANGE IN PRODUCTION
	}
	if config.AppEnv == "" {
		config.AppEnv = "development"
	}

	AppConfig = config
	return config, nil
}

func GetDSN(cfg *Config) string {
	return fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local",
		cfg.DBUser,
		cfg.DBPassword,
		cfg.DBHost,
		cfg.DBPort,
		cfg.DBName,
	)
}
