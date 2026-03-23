package entity

import (
	"time"
)

type Review struct {
	ID         uint      `gorm:"primaryKey" json:"id"`
	UserID     string    `gorm:"type:char(36);index;not null" json:"user_id"`
	LocationID string    `gorm:"type:char(36);index;not null" json:"location_id"`
	Rating     int       `gorm:"type:int;not null;check:rating >= 1 AND rating <= 5" json:"rating"`
	Comment    string    `gorm:"type:text" json:"comment"`
	CreatedAt  time.Time `json:"created_at"`
	UpdatedAt  time.Time `json:"updated_at"`

	User     User     `gorm:"foreignKey:UserID;constraint:OnDelete:CASCADE" json:"user,omitempty"`
	Location Location `gorm:"foreignKey:LocationID;constraint:OnDelete:CASCADE" json:"location,omitempty"`
}

func (Review) TableName() string {
	return "reviews"
}
