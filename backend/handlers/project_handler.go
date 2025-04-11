package handlers

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"strings"

	"github.com/fcmdias/get-it-done/backend/models/api"
	"github.com/fcmdias/get-it-done/backend/models/converters"
	"github.com/fcmdias/get-it-done/backend/models/db"
	"gorm.io/gorm"
)

type ProjectHandler struct {
	db *gorm.DB
}

func NewProjectHandler(db *gorm.DB) *ProjectHandler {
	return &ProjectHandler{db: db}
}

// CreateProject handles POST /projects
func (h *ProjectHandler) CreateProject(w http.ResponseWriter, r *http.Request) {
	var input api.ProjectCreate
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	project := &db.Project{
		Name:        input.Name,
		Description: input.Description,
		Status:      "active",
	}

	if err := h.db.Create(project).Error; err != nil {
		http.Error(w, "Failed to create project", http.StatusInternalServerError)
		return
	}

	// If there are tags to associate
	if len(input.TagIDs) > 0 {
		if err := h.db.Model(project).Association("Tags").Append(&input.TagIDs); err != nil {
			http.Error(w, "Failed to associate tags", http.StatusInternalServerError)
			return
		}
	}

	response := converters.DBProjectToResponse(project)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// GetProject handles GET /projects/:id
func (h *ProjectHandler) GetProject(w http.ResponseWriter, r *http.Request) {
	id := strings.TrimPrefix(r.URL.Path, "/projects/")
	projectID, err := strconv.ParseUint(id, 10, 64)
	if err != nil {
		http.Error(w, "Invalid project ID", http.StatusBadRequest)
		return
	}

	var project db.Project
	if err := h.db.Preload("Tags").First(&project, projectID).Error; err != nil {
		http.Error(w, "Project not found", http.StatusNotFound)
		return
	}

	response := converters.DBProjectToResponse(&project)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// UpdateProject handles PUT /projects/:id
func (h *ProjectHandler) UpdateProject(w http.ResponseWriter, r *http.Request) {
	id := strings.TrimPrefix(r.URL.Path, "/projects/")
	projectID, err := strconv.ParseUint(id, 10, 64)
	if err != nil {
		log.Printf("Error parsing project ID: %v", err)
		http.Error(w, "Invalid project ID", http.StatusBadRequest)
		return
	}

	var input api.ProjectUpdate
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		log.Printf("Error decoding request body: %v", err)
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	log.Printf("Updating project %d with input: %+v", projectID, input)

	var project db.Project
	if err := h.db.Preload("Tags").First(&project, projectID).Error; err != nil {
		log.Printf("Error finding project: %v", err)
		http.Error(w, "Project not found", http.StatusNotFound)
		return
	}

	// Track if any updates were made
	updated := false

	// Update fields if provided
	if input.Name != nil {
		log.Printf("Updating project name from '%s' to '%s'", project.Name, *input.Name)
		project.Name = *input.Name
		updated = true
	}
	if input.Description != nil {
		log.Printf("Updating project description from '%s' to '%s'", project.Description, *input.Description)
		project.Description = *input.Description
		updated = true
	}
	if input.Status != nil {
		log.Printf("Updating project status from '%s' to '%s'", project.Status, *input.Status)
		project.Status = *input.Status
		updated = true
	}

	// Update project if fields were changed
	if updated {
		if err := h.db.Save(&project).Error; err != nil {
			log.Printf("Error saving project updates: %v", err)
			http.Error(w, "Failed to update project", http.StatusInternalServerError)
			return
		}
		log.Printf("Successfully updated project fields")
	}

	// Update tags if provided
	if input.TagIDs != nil {
		log.Printf("Updating project tags to: %v", input.TagIDs)

		// First verify all tags exist
		var count int64
		if err := h.db.Model(&db.Tag{}).Where("id IN ?", input.TagIDs).Count(&count).Error; err != nil {
			log.Printf("Error verifying tags: %v", err)
			http.Error(w, "Error verifying tags", http.StatusInternalServerError)
			return
		}

		if int(count) != len(input.TagIDs) {
			log.Printf("Not all tags exist. Found %d tags, expected %d", count, len(input.TagIDs))
			http.Error(w, "One or more tags do not exist", http.StatusBadRequest)
			return
		}

		// Create a slice of Tag objects instead of just IDs
		var tags []db.Tag
		if err := h.db.Where("id IN ?", input.TagIDs).Find(&tags).Error; err != nil {
			log.Printf("Error fetching tags: %v", err)
			http.Error(w, "Failed to fetch tags", http.StatusInternalServerError)
			return
		}

		if err := h.db.Model(&project).Association("Tags").Replace(tags); err != nil {
			log.Printf("Error updating tags: %v", err)
			http.Error(w, fmt.Sprintf("Failed to update tags: %v", err), http.StatusInternalServerError)
			return
		}

		// Reload the project to get updated tags
		if err := h.db.Preload("Tags").First(&project, projectID).Error; err != nil {
			log.Printf("Error reloading project after tag update: %v", err)
			http.Error(w, "Failed to fetch updated project", http.StatusInternalServerError)
			return
		}
		log.Printf("Successfully updated project tags")
	}

	response := converters.DBProjectToResponse(&project)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
	log.Printf("Successfully completed update for project %d", projectID)
}

// DeleteProject handles DELETE /projects/:id
func (h *ProjectHandler) DeleteProject(w http.ResponseWriter, r *http.Request) {
	id := strings.TrimPrefix(r.URL.Path, "/projects/")
	projectID, err := strconv.ParseUint(id, 10, 64)
	if err != nil {
		http.Error(w, "Invalid project ID", http.StatusBadRequest)
		return
	}

	if err := h.db.Delete(&db.Project{}, projectID).Error; err != nil {
		http.Error(w, "Failed to delete project", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

// ListProjects handles GET /projects
func (h *ProjectHandler) ListProjects(w http.ResponseWriter, r *http.Request) {
	var projects []db.Project
	if err := h.db.Preload("Tags").Find(&projects).Error; err != nil {
		http.Error(w, "Failed to fetch projects", http.StatusInternalServerError)
		return
	}

	response := make([]api.ProjectResponse, len(projects))
	for i, project := range projects {
		response[i] = *converters.DBProjectToResponse(&project)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// AddProjectTags handles POST /projects/:id/tags
func (h *ProjectHandler) AddProjectTags(w http.ResponseWriter, r *http.Request) {
	// Extract project ID from path
	pathParts := strings.Split(r.URL.Path, "/")
	if len(pathParts) < 3 {
		log.Printf("Invalid path: %s", r.URL.Path)
		http.Error(w, "Invalid path", http.StatusBadRequest)
		return
	}

	projectID, err := strconv.ParseUint(pathParts[2], 10, 64)
	if err != nil {
		log.Printf("Error parsing project ID: %v", err)
		http.Error(w, "Invalid project ID", http.StatusBadRequest)
		return
	}

	// Parse request body
	var input struct {
		TagIDs []uint `json:"tag_ids"`
	}
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		log.Printf("Error decoding request body: %v", err)
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	log.Printf("Adding tags %v to project %d", input.TagIDs, projectID)

	// Check if project exists
	var project db.Project
	if err := h.db.First(&project, projectID).Error; err != nil {
		log.Printf("Project not found: %v", err)
		http.Error(w, "Project not found", http.StatusNotFound)
		return
	}

	// Verify all tags exist and fetch them
	var tags []db.Tag
	if err := h.db.Where("id IN ?", input.TagIDs).Find(&tags).Error; err != nil {
		log.Printf("Error fetching tags: %v", err)
		http.Error(w, "Failed to fetch tags", http.StatusInternalServerError)
		return
	}

	if len(tags) != len(input.TagIDs) {
		log.Printf("Not all tags exist. Found %d tags, expected %d", len(tags), len(input.TagIDs))
		http.Error(w, "One or more tags do not exist", http.StatusBadRequest)
		return
	}

	// Add tags
	if err := h.db.Model(&project).Association("Tags").Append(tags); err != nil {
		log.Printf("Error adding tags: %v", err)
		http.Error(w, fmt.Sprintf("Failed to add tags: %v", err), http.StatusInternalServerError)
		return
	}

	// Return updated project
	if err := h.db.Preload("Tags").First(&project, projectID).Error; err != nil {
		log.Printf("Error reloading project after tag update: %v", err)
		http.Error(w, "Failed to fetch updated project", http.StatusInternalServerError)
		return
	}

	response := converters.DBProjectToResponse(&project)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
	log.Printf("Successfully added tags to project %d", projectID)
}

// RemoveProjectTags handles DELETE /projects/:id/tags
func (h *ProjectHandler) RemoveProjectTags(w http.ResponseWriter, r *http.Request) {
	// Extract project ID from path
	pathParts := strings.Split(r.URL.Path, "/")
	if len(pathParts) < 3 {
		http.Error(w, "Invalid path", http.StatusBadRequest)
		return
	}
	projectID, err := strconv.ParseUint(pathParts[2], 10, 64)
	if err != nil {
		http.Error(w, "Invalid project ID", http.StatusBadRequest)
		return
	}

	// Parse request body
	var input struct {
		TagIDs []uint `json:"tag_ids"`
	}
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Check if project exists
	var project db.Project
	if err := h.db.First(&project, projectID).Error; err != nil {
		http.Error(w, "Project not found", http.StatusNotFound)
		return
	}

	// Remove tags
	if err := h.db.Model(&project).Association("Tags").Delete(&input.TagIDs); err != nil {
		http.Error(w, "Failed to remove tags", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
