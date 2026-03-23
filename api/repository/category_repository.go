package repository

import (
	"api/entity"
	"errors"

	"gorm.io/gorm"
)

type CategoryRepository interface {
	Create(category *entity.Category) error
	GetByID(id uint) (*entity.Category, error)
	GetByName(name string) (*entity.Category, error)
	Update(category *entity.Category) error
	Delete(id uint) error
	GetAll(limit, offset int) ([]entity.Category, error)
}

type categoryRepository struct {
	db *gorm.DB
}

func NewCategoryRepository(db *gorm.DB) CategoryRepository {
	return &categoryRepository{db: db}
}

func (r *categoryRepository) Create(category *entity.Category) error {
	return r.db.Create(category).Error
}

func (r *categoryRepository) GetByID(id uint) (*entity.Category, error) {
	var category entity.Category
	err := r.db.First(&category, "id = ?", id).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, errors.New("category not found")
	}
	if err != nil {
		return nil, err
	}
	return &category, nil
}

func (r *categoryRepository) GetByName(name string) (*entity.Category, error) {
	var category entity.Category
	err := r.db.First(&category, "name = ?", name).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, errors.New("category not found")
	}
	if err != nil {
		return nil, err
	}
	return &category, nil
}

func (r *categoryRepository) Update(category *entity.Category) error {
	return r.db.Save(category).Error
}

func (r *categoryRepository) Delete(id uint) error {
	return r.db.Delete(&entity.Category{}, "id = ?", id).Error
}

func (r *categoryRepository) GetAll(limit, offset int) ([]entity.Category, error) {
	var categories []entity.Category
	err := r.db.Limit(limit).Offset(offset).Find(&categories).Error
	return categories, err
}
