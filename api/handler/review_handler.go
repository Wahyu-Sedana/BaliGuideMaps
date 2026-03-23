package handler

import (
	"api/entity"
	"api/usecase"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type ReviewHandler struct {
	reviewUsecase usecase.ReviewUsecase
}

type ReviewRequest struct {
	Rating  int    `json:"rating" binding:"required,min=1,max=5"`
	Comment string `json:"comment"`
}

type ReviewCreateRequest struct {
	LocationID string `json:"location_id" binding:"required"`
	Rating     int    `json:"rating" binding:"required,min=1,max=5"`
	Comment    string `json:"comment"`
}

func NewReviewHandler(reviewUsecase usecase.ReviewUsecase) *ReviewHandler {
	return &ReviewHandler{
		reviewUsecase: reviewUsecase,
	}
}

func (h *ReviewHandler) Create(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "user not authenticated"})
		return
	}

	var req ReviewCreateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	review, err := h.reviewUsecase.CreateReview(userID.(string), req.LocationID, req.Rating, req.Comment)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, review)
}

func (h *ReviewHandler) GetByID(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid review id"})
		return
	}

	review, err := h.reviewUsecase.GetReview(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, review)
}

func (h *ReviewHandler) Update(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid review id"})
		return
	}

	var req ReviewRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	review, err := h.reviewUsecase.UpdateReview(uint(id), req.Rating, req.Comment)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, review)
}

func (h *ReviewHandler) Delete(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid review id"})
		return
	}

	if err := h.reviewUsecase.DeleteReview(uint(id)); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "review deleted successfully"})
}

func (h *ReviewHandler) GetLocationReviews(c *gin.Context) {
	locationID := c.Param("id")
	if locationID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "location id is required"})
		return
	}

	limit := c.DefaultQuery("limit", "10")
	offset := c.DefaultQuery("offset", "0")

	limitInt, _ := strconv.Atoi(limit)
	offsetInt, _ := strconv.Atoi(offset)

	reviews, err := h.reviewUsecase.GetLocationReviews(locationID, limitInt, offsetInt)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if reviews == nil {
		reviews = make([]entity.Review, 0)
	}

	// Get average rating
	avgRating, _ := h.reviewUsecase.GetAverageRating(locationID)

	c.JSON(http.StatusOK, gin.H{
		"data":           reviews,
		"average_rating": avgRating,
		"limit":          limitInt,
		"offset":         offsetInt,
	})
}

func (h *ReviewHandler) GetUserReviews(c *gin.Context) {
	userID := c.Param("userId")
	if userID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "user id is required"})
		return
	}

	limit := c.DefaultQuery("limit", "10")
	offset := c.DefaultQuery("offset", "0")

	limitInt, _ := strconv.Atoi(limit)
	offsetInt, _ := strconv.Atoi(offset)

	reviews, err := h.reviewUsecase.GetUserReviews(userID, limitInt, offsetInt)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if reviews == nil {
		reviews = make([]entity.Review, 0)
	}

	c.JSON(http.StatusOK, gin.H{
		"data":   reviews,
		"limit":  limitInt,
		"offset": offsetInt,
	})
}

func (h *ReviewHandler) GetAverageRating(c *gin.Context) {
	locationID := c.Param("id")
	if locationID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "location id is required"})
		return
	}

	avgRating, err := h.reviewUsecase.GetAverageRating(locationID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"location_id":    locationID,
		"average_rating": avgRating,
	})
}
