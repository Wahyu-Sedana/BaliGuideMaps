package entity

import (
	"time"
)

type User struct {
	ID        string    `gorm:"primaryKey;type:char(36)" json:"id"`
	Name      string    `gorm:"type:varchar(255);not null" json:"name"`
	Email     string    `gorm:"type:varchar(255);uniqueIndex;not null" json:"email"`
	Password  string    `gorm:"type:varchar(255);not null" json:"-"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`

	Reviews []Review `gorm:"foreignKey:UserID;constraint:OnDelete:CASCADE" json:"reviews,omitempty"`
}

func (User) TableName() string {
	return "users"
}
