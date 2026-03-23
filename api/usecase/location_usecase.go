package usecase

import (
	"api/entity"
	"api/repository"
	"crypto/rand"
	"encoding/hex"
	"errors"
)

type LocationUsecase interface {
	CreateLocation(name, description, address string, latitude, longitude float64, categoryID uint) (*entity.Location, error)
	GetLocation(id string) (*entity.Location, error)
	UpdateLocation(id, name, description, address string, latitude, longitude float64, categoryID uint) (*entity.Location, error)
	DeleteLocation(id string) error
	GetAllLocations(limit, offset int) ([]entity.Location, error)
	GetLocationsByCategory(categoryID uint, limit, offset int) ([]entity.Location, error)
	SearchLocations(keyword string, limit, offset int) ([]entity.Location, error)
	GetNearbyLocations(latitude, longitude, radius float64) ([]entity.Location, error)
}

type locationUsecase struct {
	locationRepo repository.LocationRepository
	categoryRepo repository.CategoryRepository
}

func NewLocationUsecase(locationRepo repository.LocationRepository, categoryRepo repository.CategoryRepository) LocationUsecase {
	return &locationUsecase{
		locationRepo: locationRepo,
		categoryRepo: categoryRepo,
	}
}

func (u *locationUsecase) CreateLocation(name, description, address string, latitude, longitude float64, categoryID uint) (*entity.Location, error) {
	if name == "" {
		return nil, errors.New("location name is required")
	}
	if latitude < -90 || latitude > 90 {
		return nil, errors.New("invalid latitude")
	}
	if longitude < -180 || longitude > 180 {
		return nil, errors.New("invalid longitude")
	}

	// Verify category exists
	_, err := u.categoryRepo.GetByID(categoryID)
	if err != nil {
		return nil, errors.New("category not found")
	}

	locationID := generateLocationID()

	location := &entity.Location{
		ID:          locationID,
		Name:        name,
		Description: description,
		Address:     address,
		Latitude:    latitude,
		Longitude:   longitude,
		CategoryID:  categoryID,
	}

	if err := u.locationRepo.Create(location); err != nil {
		return nil, errors.New("failed to create location")
	}

	return location, nil
}

func (u *locationUsecase) GetLocation(id string) (*entity.Location, error) {
	return u.locationRepo.GetByID(id)
}

func (u *locationUsecase) UpdateLocation(id, name, description, address string, latitude, longitude float64, categoryID uint) (*entity.Location, error) {
	if name == "" {
		return nil, errors.New("location name is required")
	}

	location, err := u.locationRepo.GetByID(id)
	if err != nil {
		return nil, err
	}

	if latitude < -90 || latitude > 90 {
		return nil, errors.New("invalid latitude")
	}
	if longitude < -180 || longitude > 180 {
		return nil, errors.New("invalid longitude")
	}

	// Verify category exists if changed
	if categoryID != location.CategoryID {
		_, err := u.categoryRepo.GetByID(categoryID)
		if err != nil {
			return nil, errors.New("category not found")
		}
	}

	location.Name = name
	location.Description = description
	location.Address = address
	location.Latitude = latitude
	location.Longitude = longitude
	location.CategoryID = categoryID

	if err := u.locationRepo.Update(location); err != nil {
		return nil, errors.New("failed to update location")
	}

	return location, nil
}

func (u *locationUsecase) DeleteLocation(id string) error {
	_, err := u.locationRepo.GetByID(id)
	if err != nil {
		return err
	}
	return u.locationRepo.Delete(id)
}

func (u *locationUsecase) GetAllLocations(limit, offset int) ([]entity.Location, error) {
	if limit <= 0 {
		limit = 20
	}
	if offset < 0 {
		offset = 0
	}
	return u.locationRepo.GetAll(limit, offset)
}

func (u *locationUsecase) GetLocationsByCategory(categoryID uint, limit, offset int) ([]entity.Location, error) {
	if limit <= 0 {
		limit = 20
	}
	if offset < 0 {
		offset = 0
	}

	// Verify category exists
	_, err := u.categoryRepo.GetByID(categoryID)
	if err != nil {
		return nil, errors.New("category not found")
	}

	return u.locationRepo.GetByCategory(categoryID, limit, offset)
}

func (u *locationUsecase) SearchLocations(keyword string, limit, offset int) ([]entity.Location, error) {
	if keyword == "" {
		return nil, errors.New("search keyword is required")
	}
	if limit <= 0 {
		limit = 20
	}
	if offset < 0 {
		offset = 0
	}
	return u.locationRepo.Search(keyword, limit, offset)
}

func (u *locationUsecase) GetNearbyLocations(latitude, longitude, radius float64) ([]entity.Location, error) {
	if latitude < -90 || latitude > 90 {
		return nil, errors.New("invalid latitude")
	}
	if longitude < -180 || longitude > 180 {
		return nil, errors.New("invalid longitude")
	}
	if radius <= 0 {
		radius = 5 // Default 5km
	}
	return u.locationRepo.GetNearby(latitude, longitude, radius)
}

func generateLocationID() string {
	b := make([]byte, 16)
	rand.Read(b)
	return hex.EncodeToString(b)
}
