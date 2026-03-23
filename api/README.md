# Bali Guide Map API

A comprehensive REST API for a Bali map application that displays tourism locations, health facilities, and hotels. Built with Golang, Gin framework, MySQL, and GORM using Clean Architecture.

## Tech Stack

- **Language**: Golang 1.24
- **Framework**: Gin Web Framework
- **Database**: MySQL 8.0
- **ORM**: GORM
- **Authentication**: JWT (JSON Web Tokens)
- **Architecture**: Clean Architecture (Handler, UseCase, Repository, Entity)

## Project Structure

```
api/
├── cmd/
│   └── main.go                 # Application entry point
├── config/
│   └── config.go              # Configuration management
├── entity/                     # Domain models
│   ├── user.go
│   ├── category.go
│   ├── location.go
│   └── review.go
├── repository/                 # Data access layer
│   ├── user_repository.go
│   ├── category_repository.go
│   ├── location_repository.go
│   └── review_repository.go
├── usecase/                    # Business logic layer
│   ├── auth_usecase.go
│   ├── category_usecase.go
│   ├── location_usecase.go
│   └── review_usecase.go
├── handler/                    # API handlers/controllers
│   ├── auth_handler.go
│   ├── category_handler.go
│   ├── location_handler.go
│   └── review_handler.go
├── middleware/
│   └── jwt_middleware.go       # JWT authentication middleware
├── router/
│   └── router.go              # Route configuration
├── db/
│   └── migration.go           # Database migrations
├── .env                       # Environment variables
├── .env.example              # Example environment variables
├── docker-compose.yml        # Docker services configuration
├── go.mod                    # Go module file
└── README.md                # This file
```

## Database Schema

### Users Table

```sql
CREATE TABLE users (
  id CHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### Categories Table

```sql
CREATE TABLE categories (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) UNIQUE NOT NULL
);
```

### Locations Table

```sql
CREATE TABLE locations (
  id CHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description LONGTEXT,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  address TEXT,
  category_id INT NOT NULL,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,
  KEY idx_category_id (category_id)
);
```

### Reviews Table

```sql
CREATE TABLE reviews (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id CHAR(36) NOT NULL,
  location_id CHAR(36) NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE CASCADE,
  KEY idx_user_id (user_id),
  KEY idx_location_id (location_id)
);
```

## Prerequisites

- Golang 1.24 or higher
- MySQL 8.0
- Docker & Docker Compose (optional)

## Setup & Installation

### 1. Clone the Repository

```bash
cd /path/to/BaliGuideMap/api
```

### 2. Set Up Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Update `.env` with your database credentials if needed.

### 3. Start MySQL Database

Option A: Using Docker Compose (Recommended)

```bash
docker-compose up -d
```

This will start:

- MySQL on port `3306`
- PhpMyAdmin on port `8081`

Option B: Using existing MySQL

Make sure MySQL is running and the database credentials in `.env` are correct.

### 4. Install Dependencies

```bash
go mod download
```

### 5. Run the Application

```bash
go run cmd/main.go
```

The server will start on `http://localhost:8080`

### 6. Verify Setup

Check if the server is running:

```bash
curl http://localhost:8080/api/v1/categories
```

You should get an empty array response.

## API Endpoints

### Authentication

#### Register User

```
POST /api/v1/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

Response: {
  "id": "uuid",
  "name": "John Doe",
  "email": "john@example.com",
  "token": "jwt_token"
}
```

#### Login

```
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response: {
  "id": "uuid",
  "name": "John Doe",
  "email": "john@example.com",
  "token": "jwt_token"
}
```

### Categories

#### Get All Categories

```
GET /api/v1/categories?limit=10&offset=0
```

#### Get Category by ID

```
GET /api/v1/categories/:id
```

#### Create Category (Protected)

```
POST /api/v1/categories
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "wisata"
}
```

#### Update Category (Protected)

```
PUT /api/v1/categories/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "tourism"
}
```

#### Delete Category (Protected)

```
DELETE /api/v1/categories/:id
Authorization: Bearer {token}
```

### Locations

#### Get All Locations

```
GET /api/v1/locations?limit=20&offset=0
```

#### Get Location by ID

```
GET /api/v1/locations/:id
```

#### Get Locations by Category

```
GET /api/v1/categories/:categoryId/locations?limit=20&offset=0
```

#### Search Locations

```
GET /api/v1/locations/search?q=temple&limit=20&offset=0
```

#### Get Nearby Locations

```
GET /api/v1/locations/nearby?lat=-8.6705&lon=115.2126&radius=5
```

- `lat`: Latitude (required)
- `lon`: Longitude (required)
- `radius`: Radius in kilometers (default: 5)

#### Create Location (Protected)

```
POST /api/v1/locations
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Bali Temple",
  "description": "Ancient temple with beautiful architecture",
  "address": "Bali, Indonesia",
  "latitude": -8.6705,
  "longitude": 115.2126,
  "category_id": 1
}
```

#### Update Location (Protected)

```
PUT /api/v1/locations/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Updated Temple Name",
  "description": "Updated description",
  "address": "Bali, Indonesia",
  "latitude": -8.6705,
  "longitude": 115.2126,
  "category_id": 1
}
```

#### Delete Location (Protected)

```
DELETE /api/v1/locations/:id
Authorization: Bearer {token}
```

### Reviews

#### Get Location Reviews

```
GET /api/v1/locations/:locationId/reviews?limit=10&offset=0
```

#### Get Location Average Rating

```
GET /api/v1/locations/:locationId/reviews/rating
```

#### Get User Reviews (Protected)

```
GET /api/v1/users/:userId/reviews?limit=10&offset=0
Authorization: Bearer {token}
```

#### Create Review (Protected)

```
POST /api/v1/reviews
Authorization: Bearer {token}
Content-Type: application/json

{
  "location_id": "location-uuid",
  "rating": 5,
  "comment": "Amazing place!"
}
```

#### Update Review (Protected)

```
PUT /api/v1/reviews/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "rating": 4,
  "comment": "Good place"
}
```

#### Delete Review (Protected)

```
DELETE /api/v1/reviews/:id
Authorization: Bearer {token}
```

## Predefined Categories

The following categories are seeded automatically:

1. **wisata** (Tourism)
2. **health** (Health Services)
3. **hotel** (Accommodation)

## Architecture Overview

### Clean Architecture Layers

```
┌─────────────────────────────────────────────────────┐
│              HTTP Handlers/Middleware                │
├─────────────────────────────────────────────────────┤
│              Use Cases (Business Logic)              │
├─────────────────────────────────────────────────────┤
│         Repositories (Data Access Layer)             │
├─────────────────────────────────────────────────────┤
│           External Services (Database)               │
└─────────────────────────────────────────────────────┘
```

### Data Flow

```
Request → Router → Handler → UseCase → Repository → Database
         → Response
```

## JWT Authentication

- JWT tokens are required for protected endpoints
- Include the token in the `Authorization` header: `Bearer {token}`
- Token expiration: 24 hours (configurable in `.env`)
- Secret key must be changed in production

## Error Handling

The API returns appropriate HTTP status codes:

- `200 OK` - Successful request
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Missing or invalid token
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

Error responses include an error message:

```json
{
  "error": "User not found"
}
```

## Testing with cURL

### Register a new user

```bash
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Get categories

```bash
curl http://localhost:8080/api/v1/categories
```

### Create a location (requires token)

```bash
curl -X POST http://localhost:8080/api/v1/locations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {your-jwt-token}" \
  -d '{
    "name": "Bali Temple",
    "description": "Ancient temple",
    "address": "Bali",
    "latitude": -8.6705,
    "longitude": 115.2126,
    "category_id": 1
  }'
```

## Development

### Hot Reload (Optional)

Install `air` for hot reload during development:

```bash
go install github.com/cosmtrek/air@latest
air
```

### Database Administration

Open PhpMyAdmin at `http://localhost:8081` to manage the database:

- Username: `root`
- Password: `password`

## Deployment

### Production Checklist

- [ ] Change `JWT_SECRET` in `.env`
- [ ] Change `DB_PASSWORD` and database credentials
- [ ] Set `APP_ENV=production`
- [ ] Enable HTTPS
- [ ] Configure proper CORS allowed origins
- [ ] Set up proper logging
- [ ] Configure database backups
- [ ] Use environment variables for sensitive data

## Troubleshooting

### Cannot connect to MySQL

1. Verify MySQL is running: `docker-compose ps`
2. Check database credentials in `.env`
3. Ensure port `3306` is not in use
4. Check MySQL logs: `docker-compose logs mysql`

### Port already in use

- Server: Change `APP_PORT` in `.env`
- MySQL: Change port mapping in `docker-compose.yml`

### JWT token errors

- Ensure token is correctly formatted: `Bearer {token}`
- Check token hasn't expired (default 24 hours)
- Verify `JWT_SECRET` matches

## License

This project is licensed under the MIT License.

## Support

For issues or questions, please create an issue in the repository.

## Future Enhancements

- [ ] Add image/photo support for locations
- [ ] Implement pagination helpers
- [ ] Add API documentation with Swagger/OpenAPI
- [ ] Implement caching with Redis
- [ ] Add more comprehensive error handling
- [ ] Implement rate limiting
- [ ] Add logging and monitoring
- [ ] Create mobile app integration guide
