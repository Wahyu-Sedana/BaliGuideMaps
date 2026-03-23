package router

import (
	"api/config"
	"api/handler"
	"api/middleware"
	"api/repository"
	"api/usecase"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func SetupRouter(db *gorm.DB, cfg *config.Config) *gin.Engine {
	router := gin.Default()

	// CORS middleware
	router.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE, PATCH")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	})

	// Initialize repositories
	userRepo := repository.NewUserRepository(db)
	categoryRepo := repository.NewCategoryRepository(db)
	locationRepo := repository.NewLocationRepository(db)
	reviewRepo := repository.NewReviewRepository(db)

	// Initialize usecases
	authUsecase := usecase.NewAuthUsecase(userRepo)
	categoryUsecase := usecase.NewCategoryUsecase(categoryRepo)
	locationUsecase := usecase.NewLocationUsecase(locationRepo, categoryRepo)
	reviewUsecase := usecase.NewReviewUsecase(reviewRepo, userRepo, locationRepo)

	// Initialize handlers
	authHandler := handler.NewAuthHandler(authUsecase, cfg)
	categoryHandler := handler.NewCategoryHandler(categoryUsecase)
	locationHandler := handler.NewLocationHandler(locationUsecase)
	reviewHandler := handler.NewReviewHandler(reviewUsecase)

	// Public routes
	public := router.Group("/api/v1")
	{
		// Auth routes
		auth := public.Group("/auth")
		{
			auth.POST("/register", authHandler.Register)
			auth.POST("/login", authHandler.Login)
		}

		// Public location routes
		locations := public.Group("/locations")
		{
			locations.GET("", locationHandler.GetAll)
			locations.GET("/search", locationHandler.Search)
			locations.GET("/nearby", locationHandler.GetNearby)
			locations.GET("/:id", locationHandler.GetByID)
			locations.GET("/:id/reviews", reviewHandler.GetLocationReviews)
			locations.GET("/:id/reviews/rating", reviewHandler.GetAverageRating)
		}

		// Public category routes
		categories := public.Group("/categories")
		{
			categories.GET("", categoryHandler.GetAll)
			categories.GET("/:id", categoryHandler.GetByID)
			categories.GET("/:id/locations", locationHandler.GetByCategory)
		}
	}

	// Protected routes
	protected := router.Group("/api/v1")
	protected.Use(middleware.JWTMiddleware(cfg))
	{
		// Protected location routes
		locations := protected.Group("/locations")
		{
			locations.POST("", locationHandler.Create)
			locations.PUT("/:id", locationHandler.Update)
			locations.DELETE("/:id", locationHandler.Delete)
		}

		// Protected category routes
		categories := protected.Group("/categories")
		{
			categories.POST("", categoryHandler.Create)
			categories.PUT("/:id", categoryHandler.Update)
			categories.DELETE("/:id", categoryHandler.Delete)
		}

		// Protected review routes
		reviews := protected.Group("/reviews")
		{
			reviews.POST("", reviewHandler.Create)
			reviews.GET("/:id", reviewHandler.GetByID)
			reviews.PUT("/:id", reviewHandler.Update)
			reviews.DELETE("/:id", reviewHandler.Delete)
		}

		userReviews := protected.Group("/users/:userId/reviews")
		{
			userReviews.GET("", reviewHandler.GetUserReviews)
		}
	}

	return router
}
