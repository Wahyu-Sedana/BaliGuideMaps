package entity

import (
	"time"
)

type Location struct {
	ID          string    `gorm:"primaryKey;type:char(36)" json:"id"`
	Name        string    `gorm:"type:varchar(255);not null;index" json:"name"`
	Description string    `gorm:"type:longtext" json:"description"`
	Latitude    float64   `gorm:"type:decimal(10,8);not null" json:"latitude"`
	Longitude   float64   `gorm:"type:decimal(11,8);not null" json:"longitude"`
	Address     string    `gorm:"type:varchar(500)" json:"address"`
	CategoryID  uint      `gorm:"index;not null" json:"category_id"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`

	Category Category `gorm:"foreignKey:CategoryID;constraint:OnDelete:RESTRICT" json:"category"`
	Reviews  []Review `gorm:"foreignKey:LocationID;constraint:OnDelete:CASCADE" json:"reviews,omitempty"`
}

func (Location) TableName() string {
	return "locations"
}
