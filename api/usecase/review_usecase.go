package usecase

import (
	"api/entity"
	"api/repository"
	"errors"
)

type ReviewUsecase interface {
	CreateReview(userID, locationID string, rating int, comment string) (*entity.Review, error)
	GetReview(id uint) (*entity.Review, error)
	UpdateReview(id uint, rating int, comment string) (*entity.Review, error)
	DeleteReview(id uint) error
	GetLocationReviews(locationID string, limit, offset int) ([]entity.Review, error)
	GetUserReviews(userID string, limit, offset int) ([]entity.Review, error)
	GetAverageRating(locationID string) (float64, error)
}

type reviewUsecase struct {
	reviewRepo   repository.ReviewRepository
	userRepo     repository.UserRepository
	locationRepo repository.LocationRepository
}

func NewReviewUsecase(reviewRepo repository.ReviewRepository, userRepo repository.UserRepository, locationRepo repository.LocationRepository) ReviewUsecase {
	return &reviewUsecase{
		reviewRepo:   reviewRepo,
		userRepo:     userRepo,
		locationRepo: locationRepo,
	}
}

func (u *reviewUsecase) CreateReview(userID, locationID string, rating int, comment string) (*entity.Review, error) {
	if userID == "" || locationID == "" {
		return nil, errors.New("user ID and location ID are required")
	}
	if rating < 1 || rating > 5 {
		return nil, errors.New("rating must be between 1 and 5")
	}

	// Verify user exists
	_, err := u.userRepo.GetByID(userID)
	if err != nil {
		return nil, errors.New("user not found")
	}

	// Verify location exists
	_, err = u.locationRepo.GetByID(locationID)
	if err != nil {
		return nil, errors.New("location not found")
	}

	review := &entity.Review{
		UserID:     userID,
		LocationID: locationID,
		Rating:     rating,
		Comment:    comment,
	}

	if err := u.reviewRepo.Create(review); err != nil {
		return nil, errors.New("failed to create review")
	}

	return review, nil
}

func (u *reviewUsecase) GetReview(id uint) (*entity.Review, error) {
	return u.reviewRepo.GetByID(id)
}

func (u *reviewUsecase) UpdateReview(id uint, rating int, comment string) (*entity.Review, error) {
	if rating < 1 || rating > 5 {
		return nil, errors.New("rating must be between 1 and 5")
	}

	review, err := u.reviewRepo.GetByID(id)
	if err != nil {
		return nil, err
	}

	review.Rating = rating
	review.Comment = comment

	if err := u.reviewRepo.Update(review); err != nil {
		return nil, errors.New("failed to update review")
	}

	return review, nil
}

func (u *reviewUsecase) DeleteReview(id uint) error {
	_, err := u.reviewRepo.GetByID(id)
	if err != nil {
		return err
	}
	return u.reviewRepo.Delete(id)
}

func (u *reviewUsecase) GetLocationReviews(locationID string, limit, offset int) ([]entity.Review, error) {
	if locationID == "" {
		return nil, errors.New("location ID is required")
	}
	if limit <= 0 {
		limit = 10
	}
	if offset < 0 {
		offset = 0
	}

	// Verify location exists
	_, err := u.locationRepo.GetByID(locationID)
	if err != nil {
		return nil, errors.New("location not found")
	}

	return u.reviewRepo.GetByLocation(locationID, limit, offset)
}

func (u *reviewUsecase) GetUserReviews(userID string, limit, offset int) ([]entity.Review, error) {
	if userID == "" {
		return nil, errors.New("user ID is required")
	}
	if limit <= 0 {
		limit = 10
	}
	if offset < 0 {
		offset = 0
	}

	// Verify user exists
	_, err := u.userRepo.GetByID(userID)
	if err != nil {
		return nil, errors.New("user not found")
	}

	return u.reviewRepo.GetByUser(userID, limit, offset)
}

func (u *reviewUsecase) GetAverageRating(locationID string) (float64, error) {
	if locationID == "" {
		return 0, errors.New("location ID is required")
	}

	// Verify location exists
	_, err := u.locationRepo.GetByID(locationID)
	if err != nil {
		return 0, errors.New("location not found")
	}

	return u.reviewRepo.GetAverageRating(locationID)
}
