package models

import (
	"github.com/fcmdias/get-it-done/backend/models/db"
	"gorm.io/gorm"
)

// AutoMigrate will create and migrate the tables
func AutoMigrate(database *gorm.DB) error {
	return database.AutoMigrate(
		&db.Project{},
		&db.Tag{},
		&db.ProjectTag{},
	)
}
