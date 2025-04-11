package converters

import (
	"time"

	"github.com/fcmdias/get-it-done/backend/models/api"
	"github.com/fcmdias/get-it-done/backend/models/db"
)

// DBProjectToResponse converts a database project model to an API response model
func DBProjectToResponse(project *db.Project) *api.ProjectResponse {
	tags := make([]api.TagResponse, 0, len(project.Tags))
	for _, tag := range project.Tags {
		tags = append(tags, api.TagResponse{
			ID:   tag.ID,
			Name: tag.Name,
		})
	}

	return &api.ProjectResponse{
		ID:          project.ID,
		Name:        project.Name,
		Description: project.Description,
		Status:      project.Status,
		Tags:        tags,
		CreatedAt:   project.CreatedAt.Format(time.RFC3339),
		UpdatedAt:   project.UpdatedAt.Format(time.RFC3339),
	}
}
