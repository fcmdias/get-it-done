package api

// TagCreate represents the model for creating a new tag
type TagCreate struct {
	Name string `json:"name" binding:"required"`
}

// TagUpdate represents the model for updating a tag
type TagUpdate struct {
	Name string `json:"name" binding:"required"`
}

// TagResponse represents the model for tag responses
type TagResponse struct {
	ID   uint   `json:"id"`
	Name string `json:"name"`
}
