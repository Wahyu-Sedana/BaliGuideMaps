package usecase

import (
	"api/entity"
	"api/repository"
	"errors"
)

type CategoryUsecase interface {
	CreateCategory(name string) (*entity.Category, error)
	GetCategory(id uint) (*entity.Category, error)
	GetCategoryByName(name string) (*entity.Category, error)
	UpdateCategory(id uint, name string) (*entity.Category, error)
	DeleteCategory(id uint) error
	GetAllCategories(limit, offset int) ([]entity.Category, error)
}

type categoryUsecase struct {
	categoryRepo repository.CategoryRepository
}

func NewCategoryUsecase(categoryRepo repository.CategoryRepository) CategoryUsecase {
	return &categoryUsecase{
		categoryRepo: categoryRepo,
	}
}

func (u *categoryUsecase) CreateCategory(name string) (*entity.Category, error) {
	if name == "" {
		return nil, errors.New("category name is required")
	}

	// Check if category already exists
	existingCategory, _ := u.categoryRepo.GetByName(name)
	if existingCategory != nil {
		return nil, errors.New("category already exists")
	}

	category := &entity.Category{
		Name: name,
	}

	if err := u.categoryRepo.Create(category); err != nil {
		return nil, errors.New("failed to create category")
	}

	return category, nil
}

func (u *categoryUsecase) GetCategory(id uint) (*entity.Category, error) {
	return u.categoryRepo.GetByID(id)
}

func (u *categoryUsecase) GetCategoryByName(name string) (*entity.Category, error) {
	return u.categoryRepo.GetByName(name)
}

func (u *categoryUsecase) UpdateCategory(id uint, name string) (*entity.Category, error) {
	if name == "" {
		return nil, errors.New("category name is required")
	}

	category, err := u.categoryRepo.GetByID(id)
	if err != nil {
		return nil, err
	}

	category.Name = name
	if err := u.categoryRepo.Update(category); err != nil {
		return nil, errors.New("failed to update category")
	}

	return category, nil
}

func (u *categoryUsecase) DeleteCategory(id uint) error {
	_, err := u.categoryRepo.GetByID(id)
	if err != nil {
		return err
	}
	return u.categoryRepo.Delete(id)
}

func (u *categoryUsecase) GetAllCategories(limit, offset int) ([]entity.Category, error) {
	if limit <= 0 {
		limit = 10
	}
	if offset < 0 {
		offset = 0
	}
	return u.categoryRepo.GetAll(limit, offset)
}
