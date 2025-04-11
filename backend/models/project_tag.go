package models

import "time"

type ProjectTag struct {
	ProjectID uint      `json:"project_id" gorm:"primaryKey"`
	TagID     uint      `json:"tag_id" gorm:"primaryKey"`
	CreatedAt time.Time `json:"created_at"`
	Project   Project   `json:"-" gorm:"foreignKey:ProjectID"`
	Tag       Tag       `json:"-" gorm:"foreignKey:TagID"`
}

// TableName overrides the table name
func (ProjectTag) TableName() string {
	return "project_tags"
}
