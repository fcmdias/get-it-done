package db

import "time"

// ProjectTag represents the database model for the project-tag relationship
type ProjectTag struct {
	ProjectID uint      `json:"project_id" gorm:"primaryKey"`
	TagID     uint      `json:"tag_id" gorm:"primaryKey"`
	CreatedAt time.Time `json:"created_at"`
	Project   Project   `json:"-" gorm:"foreignKey:ProjectID"`
	Tag       Tag       `json:"-" gorm:"foreignKey:TagID"`
}

func (ProjectTag) TableName() string {
	return "project_tags"
}
