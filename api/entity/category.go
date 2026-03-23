package entity

type Category struct {
	ID   uint   `gorm:"primaryKey" json:"id"`
	Name string `gorm:"type:varchar(100);uniqueIndex;not null" json:"name"`

	Locations []Location `gorm:"foreignKey:CategoryID;constraint:OnDelete:RESTRICT" json:"locations,omitempty"`
}

func (Category) TableName() string {
	return "categories"
}
