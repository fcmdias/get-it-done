package db

import (
	"time"

	"gorm.io/gorm"
)

// Project represents the database model for projects
type Project struct {
	ID          uint           `json:"id" gorm:"primaryKey"`
	Name        string         `json:"name" gorm:"not null"`
	Description string         `json:"description"`
	Status      string         `json:"status" gorm:"default:'active'"`
	Tags        []Tag          `json:"tags" gorm:"many2many:project_tags;"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `json:"deleted_at" gorm:"index"`
}
