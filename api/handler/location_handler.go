package handler

import (
	"api/entity"
	"api/usecase"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type LocationHandler struct {
	locationUsecase usecase.LocationUsecase
}

type LocationRequest struct {
	Name        string  `json:"name" binding:"required"`
	Description string  `json:"description"`
	Address     string  `json:"address"`
	Latitude    float64 `json:"latitude" binding:"required"`
	Longitude   float64 `json:"longitude" binding:"required"`
	CategoryID  uint    `json:"category_id" binding:"required"`
}

func NewLocationHandler(locationUsecase usecase.LocationUsecase) *LocationHandler {
	return &LocationHandler{
		locationUsecase: locationUsecase,
	}
}

func (h *LocationHandler) Create(c *gin.Context) {
	var req LocationRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	location, err := h.locationUsecase.CreateLocation(req.Name, req.Description, req.Address, req.Latitude, req.Longitude, req.CategoryID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, location)
}

func (h *LocationHandler) GetByID(c *gin.Context) {
	id := c.Param("id")

	location, err := h.locationUsecase.GetLocation(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, location)
}

func (h *LocationHandler) Update(c *gin.Context) {
	id := c.Param("id")

	var req LocationRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	location, err := h.locationUsecase.UpdateLocation(id, req.Name, req.Description, req.Address, req.Latitude, req.Longitude, req.CategoryID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, location)
}

func (h *LocationHandler) Delete(c *gin.Context) {
	id := c.Param("id")

	if err := h.locationUsecase.DeleteLocation(id); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "location deleted successfully"})
}

func (h *LocationHandler) GetAll(c *gin.Context) {
	limit := c.DefaultQuery("limit", "20")
	offset := c.DefaultQuery("offset", "0")

	limitInt, _ := strconv.Atoi(limit)
	offsetInt, _ := strconv.Atoi(offset)

	locations, err := h.locationUsecase.GetAllLocations(limitInt, offsetInt)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if locations == nil {
		locations = make([]entity.Location, 0)
	}

	c.JSON(http.StatusOK, gin.H{
		"data":   locations,
		"limit":  limitInt,
		"offset": offsetInt,
	})
}

func (h *LocationHandler) GetByCategory(c *gin.Context) {
	categoryIDStr := c.Param("id")
	categoryID, err := strconv.ParseUint(categoryIDStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid category id"})
		return
	}

	limit := c.DefaultQuery("limit", "20")
	offset := c.DefaultQuery("offset", "0")

	limitInt, _ := strconv.Atoi(limit)
	offsetInt, _ := strconv.Atoi(offset)

	locations, err := h.locationUsecase.GetLocationsByCategory(uint(categoryID), limitInt, offsetInt)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if locations == nil {
		locations = make([]entity.Location, 0)
	}

	c.JSON(http.StatusOK, gin.H{
		"data":   locations,
		"limit":  limitInt,
		"offset": offsetInt,
	})
}

func (h *LocationHandler) Search(c *gin.Context) {
	keyword := c.Query("q")
	if keyword == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "search keyword is required"})
		return
	}

	limit := c.DefaultQuery("limit", "20")
	offset := c.DefaultQuery("offset", "0")

	limitInt, _ := strconv.Atoi(limit)
	offsetInt, _ := strconv.Atoi(offset)

	locations, err := h.locationUsecase.SearchLocations(keyword, limitInt, offsetInt)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if locations == nil {
		locations = make([]entity.Location, 0)
	}

	c.JSON(http.StatusOK, gin.H{
		"data":    locations,
		"keyword": keyword,
		"limit":   limitInt,
		"offset":  offsetInt,
	})
}

func (h *LocationHandler) GetNearby(c *gin.Context) {
	latStr := c.Query("lat")
	lonStr := c.Query("lon")
	radiusStr := c.DefaultQuery("radius", "5")

	if latStr == "" || lonStr == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "latitude and longitude are required"})
		return
	}

	lat, err := strconv.ParseFloat(latStr, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid latitude"})
		return
	}

	lon, err := strconv.ParseFloat(lonStr, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid longitude"})
		return
	}

	radius, err := strconv.ParseFloat(radiusStr, 64)
	if err != nil {
		radius = 5
	}

	locations, err := h.locationUsecase.GetNearbyLocations(lat, lon, radius)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if locations == nil {
		locations = make([]entity.Location, 0)
	}

	c.JSON(http.StatusOK, gin.H{
		"data":      locations,
		"latitude":  lat,
		"longitude": lon,
		"radius":    radius,
	})
}
