package repository

import (
	"api/entity"
	"errors"
	"sync"

	"gorm.io/gorm"
)

type LocationRepository interface {
	Create(location *entity.Location) error
	GetByID(id string) (*entity.Location, error)
	Update(location *entity.Location) error
	Delete(id string) error
	GetAll(limit, offset int) ([]entity.Location, error)
	GetByCategory(categoryID uint, limit, offset int) ([]entity.Location, error)
	Search(keyword string, limit, offset int) ([]entity.Location, error)
	GetNearby(latitude, longitude, radius float64) ([]entity.Location, error)
}

type locationRepository struct {
	db *gorm.DB
}

func NewLocationRepository(db *gorm.DB) LocationRepository {
	return &locationRepository{db: db}
}

// listSelect: skip description (longtext) untuk list view — hemat bandwidth & query time
const listSelect = "locations.id, locations.name, locations.latitude, locations.longitude, locations.address, locations.category_id, locations.created_at, locations.updated_at"

func (r *locationRepository) Create(location *entity.Location) error {
	return r.db.Create(location).Error
}

func (r *locationRepository) GetByID(id string) (*entity.Location, error) {
	var location entity.Location
	err := r.db.Preload("Category").Preload("Reviews").First(&location, "id = ?", id).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, errors.New("location not found")
	}
	return &location, err
}

func (r *locationRepository) Update(location *entity.Location) error {
	return r.db.Save(location).Error
}

func (r *locationRepository) Delete(id string) error {
	return r.db.Delete(&entity.Location{}, "id = ?", id).Error
}

// GetAll: single JOIN query, skip description
func (r *locationRepository) GetAll(limit, offset int) ([]entity.Location, error) {
	var locations []entity.Location
	err := r.db.
		Select(listSelect).
		Joins("JOIN categories ON categories.id = locations.category_id").
		Preload("Category").
		Limit(limit).Offset(offset).
		Find(&locations).Error
	return locations, err
}

// GetByCategory: single JOIN query, filter kategori
func (r *locationRepository) GetByCategory(categoryID uint, limit, offset int) ([]entity.Location, error) {
	var locations []entity.Location
	err := r.db.
		Select(listSelect).
		Joins("JOIN categories ON categories.id = locations.category_id").
		Preload("Category").
		Where("locations.category_id = ?", categoryID).
		Limit(limit).Offset(offset).
		Find(&locations).Error
	return locations, err
}

// Search: hanya cari di name & address (skip description LIKE yang lambat di longtext)
func (r *locationRepository) Search(keyword string, limit, offset int) ([]entity.Location, error) {
	var locations []entity.Location
	like := "%" + keyword + "%"
	err := r.db.
		Select(listSelect).
		Joins("JOIN categories ON categories.id = locations.category_id").
		Preload("Category").
		Where("locations.name LIKE ? OR locations.address LIKE ?", like, like).
		Limit(limit).Offset(offset).
		Find(&locations).Error
	return locations, err
}

// GetNearby: goroutine untuk fetch location + category secara parallel
func (r *locationRepository) GetNearby(latitude, longitude, radius float64) ([]entity.Location, error) {
	var (
		locations []entity.Location
		fetchErr  error
		wg        sync.WaitGroup
	)

	wg.Add(1)
	go func() {
		defer wg.Done()
		fetchErr = r.db.
			Select(listSelect).
			Joins("JOIN categories ON categories.id = locations.category_id").
			Preload("Category").
			Where(
				"(6371 * acos(cos(radians(?)) * cos(radians(latitude)) * cos(radians(longitude) - radians(?)) + sin(radians(?)) * sin(radians(latitude)))) <= ?",
				latitude, longitude, latitude, radius,
			).
			Find(&locations).Error
	}()

	wg.Wait()
	return locations, fetchErr
}
