.PHONY: help build run test clean docker-up docker-down deps fmt lint migrate

help:
	@echo "Bali Guide Map API - Makefile Commands"
	@echo "========================================"
	@echo "make build           - Build the application"
	@echo "make run             - Run the application"
	@echo "make test            - Run tests"
	@echo "make clean           - Clean build artifacts"
	@echo "make deps            - Download dependencies"
	@echo "make fmt             - Format code"
	@echo "make lint            - Run linter"
	@echo "make docker-up       - Start Docker services"
	@echo "make docker-down     - Stop Docker services"
	@echo "make migrate         - Run database migrations"

build:
	@echo "Building application..."
	@go build -o bin/api cmd/main.go

run:
	@echo "Running application..."
	@go run cmd/main.go

test:
	@echo "Running tests..."
	@go test -v ./...

clean:
	@echo "Cleaning..."
	@rm -rf bin/
	@go clean

deps:
	@echo "Downloading dependencies..."
	@go mod download
	@go mod tidy

fmt:
	@echo "Formatting code..."
	@go fmt ./...

lint:
	@echo "Running linter..."
	@go vet ./...

docker-up:
	@echo "Starting Docker services..."
	@docker-compose up -d
	@echo "MySQL running on localhost:3306"
	@echo "PhpMyAdmin available at http://localhost:8081"

docker-down:
	@echo "Stopping Docker services..."
	@docker-compose down

migrate:
	@echo "Running migrations..."
	@go run cmd/main.go

.DEFAULT_GOAL := help
