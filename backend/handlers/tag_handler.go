package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"
	"strings"

	"github.com/fcmdias/get-it-done/backend/models/api"
	"github.com/fcmdias/get-it-done/backend/models/db"
	"gorm.io/gorm"
)

type TagHandler struct {
	db *gorm.DB
}

func NewTagHandler(db *gorm.DB) *TagHandler {
	return &TagHandler{db: db}
}

// CreateTag handles POST /tags
func (h *TagHandler) CreateTag(w http.ResponseWriter, r *http.Request) {
	var input api.TagCreate
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	tag := &db.Tag{
		Name: input.Name,
	}

	if err := h.db.Create(tag).Error; err != nil {
		http.Error(w, "Failed to create tag", http.StatusInternalServerError)
		return
	}

	response := api.TagResponse{
		ID:   tag.ID,
		Name: tag.Name,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// GetTag handles GET /tags/:id
func (h *TagHandler) GetTag(w http.ResponseWriter, r *http.Request) {
	id := strings.TrimPrefix(r.URL.Path, "/tags/")
	tagID, err := strconv.ParseUint(id, 10, 64)
	if err != nil {
		http.Error(w, "Invalid tag ID", http.StatusBadRequest)
		return
	}

	var tag db.Tag
	if err := h.db.First(&tag, tagID).Error; err != nil {
		http.Error(w, "Tag not found", http.StatusNotFound)
		return
	}

	response := api.TagResponse{
		ID:   tag.ID,
		Name: tag.Name,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// UpdateTag handles PUT /tags/:id
func (h *TagHandler) UpdateTag(w http.ResponseWriter, r *http.Request) {
	id := strings.TrimPrefix(r.URL.Path, "/tags/")
	tagID, err := strconv.ParseUint(id, 10, 64)
	if err != nil {
		http.Error(w, "Invalid tag ID", http.StatusBadRequest)
		return
	}

	var input api.TagUpdate
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	var tag db.Tag
	if err := h.db.First(&tag, tagID).Error; err != nil {
		http.Error(w, "Tag not found", http.StatusNotFound)
		return
	}

	tag.Name = input.Name

	if err := h.db.Save(&tag).Error; err != nil {
		http.Error(w, "Failed to update tag", http.StatusInternalServerError)
		return
	}

	response := api.TagResponse{
		ID:   tag.ID,
		Name: tag.Name,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// DeleteTag handles DELETE /tags/:id
func (h *TagHandler) DeleteTag(w http.ResponseWriter, r *http.Request) {
	id := strings.TrimPrefix(r.URL.Path, "/tags/")
	tagID, err := strconv.ParseUint(id, 10, 64)
	if err != nil {
		http.Error(w, "Invalid tag ID", http.StatusBadRequest)
		return
	}

	// First check if tag is associated with any projects
	var count int64
	if err := h.db.Model(&db.ProjectTag{}).Where("tag_id = ?", tagID).Count(&count).Error; err != nil {
		http.Error(w, "Failed to check tag usage", http.StatusInternalServerError)
		return
	}

	if count > 0 {
		http.Error(w, "Cannot delete tag that is still in use", http.StatusConflict)
		return
	}

	if err := h.db.Delete(&db.Tag{}, tagID).Error; err != nil {
		http.Error(w, "Failed to delete tag", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

// ListTags handles GET /tags
func (h *TagHandler) ListTags(w http.ResponseWriter, r *http.Request) {
	var tags []db.Tag
	if err := h.db.Find(&tags).Error; err != nil {
		http.Error(w, "Failed to fetch tags", http.StatusInternalServerError)
		return
	}

	response := make([]api.TagResponse, len(tags))
	for i, tag := range tags {
		response[i] = api.TagResponse{
			ID:   tag.ID,
			Name: tag.Name,
		}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}
