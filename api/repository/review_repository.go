package repository

import (
	"api/entity"
	"errors"

	"gorm.io/gorm"
)

type ReviewRepository interface {
	Create(review *entity.Review) error
	GetByID(id uint) (*entity.Review, error)
	Update(review *entity.Review) error
	Delete(id uint) error
	GetByLocation(locationID string, limit, offset int) ([]entity.Review, error)
	GetByUser(userID string, limit, offset int) ([]entity.Review, error)
	GetAverageRating(locationID string) (float64, error)
}

type reviewRepository struct {
	db *gorm.DB
}

func NewReviewRepository(db *gorm.DB) ReviewRepository {
	return &reviewRepository{db: db}
}

func (r *reviewRepository) Create(review *entity.Review) error {
	return r.db.Create(review).Error
}

func (r *reviewRepository) GetByID(id uint) (*entity.Review, error) {
	var review entity.Review
	err := r.db.Preload("User").Preload("Location").First(&review, "id = ?", id).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, errors.New("review not found")
	}
	if err != nil {
		return nil, err
	}
	return &review, nil
}

func (r *reviewRepository) Update(review *entity.Review) error {
	return r.db.Save(review).Error
}

func (r *reviewRepository) Delete(id uint) error {
	return r.db.Delete(&entity.Review{}, "id = ?", id).Error
}

func (r *reviewRepository) GetByLocation(locationID string, limit, offset int) ([]entity.Review, error) {
	var reviews []entity.Review
	err := r.db.Where("location_id = ?", locationID).Preload("User").Limit(limit).Offset(offset).Find(&reviews).Error
	return reviews, err
}

func (r *reviewRepository) GetByUser(userID string, limit, offset int) ([]entity.Review, error) {
	var reviews []entity.Review
	err := r.db.Where("user_id = ?", userID).Preload("Location").Limit(limit).Offset(offset).Find(&reviews).Error
	return reviews, err
}

func (r *reviewRepository) GetAverageRating(locationID string) (float64, error) {
	var avgRating float64
	err := r.db.Model(&entity.Review{}).Where("location_id = ?", locationID).Select("COALESCE(AVG(rating), 0)").Scan(&avgRating).Error
	return avgRating, err
}
