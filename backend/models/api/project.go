package api

// ProjectCreate represents the model for creating a new project
type ProjectCreate struct {
	Name        string `json:"name" binding:"required"`
	Description string `json:"description"`
	TagIDs      []uint `json:"tag_ids,omitempty"`
}

// ProjectUpdate represents the model for updating a project
type ProjectUpdate struct {
	Name        *string `json:"name,omitempty"`
	Description *string `json:"description,omitempty"`
	Status      *string `json:"status,omitempty"`
	TagIDs      []uint  `json:"tag_ids,omitempty"`
}

// ProjectResponse represents the model for project responses
type ProjectResponse struct {
	ID          uint          `json:"id"`
	Name        string        `json:"name"`
	Description string        `json:"description"`
	Status      string        `json:"status"`
	Tags        []TagResponse `json:"tags,omitempty"`
	CreatedAt   string        `json:"created_at"`
	UpdatedAt   string        `json:"updated_at"`
}
