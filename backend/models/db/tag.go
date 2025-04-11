package db

import (
	"time"

	"gorm.io/gorm"
)

// Tag represents the database model for tags
type Tag struct {
	ID        uint           `json:"id" gorm:"primaryKey"`
	Name      string         `json:"name" gorm:"unique;not null"`
	Projects  []Project      `json:"projects" gorm:"many2many:project_tags;"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"deleted_at" gorm:"index"`
}
