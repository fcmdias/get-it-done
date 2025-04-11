package routes

import (
	"net/http"
	"strings"

	"github.com/fcmdias/get-it-done/backend/handlers"
	"gorm.io/gorm"
)

type Router struct {
	db *gorm.DB
}

func NewRouter(db *gorm.DB) *Router {
	return &Router{db: db}
}

func (r *Router) SetupRoutes() http.Handler {
	mux := http.NewServeMux()

	projectHandler := handlers.NewProjectHandler(r.db)
	tagHandler := handlers.NewTagHandler(r.db)

	// Project routes
	mux.HandleFunc("/projects/", func(w http.ResponseWriter, r *http.Request) {
		// Extract path for tag operations
		pathParts := strings.Split(r.URL.Path, "/")
		if len(pathParts) > 3 && pathParts[3] == "tags" {
			switch r.Method {
			case http.MethodPost:
				projectHandler.AddProjectTags(w, r)
			case http.MethodDelete:
				projectHandler.RemoveProjectTags(w, r)
			default:
				http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			}
			return
		}

		// Existing project routes...
		switch r.Method {
		case http.MethodPost:
			projectHandler.CreateProject(w, r)
		case http.MethodGet:
			if strings.TrimPrefix(r.URL.Path, "/projects/") == "" {
				projectHandler.ListProjects(w, r)
			} else {
				projectHandler.GetProject(w, r)
			}
		case http.MethodPut:
			projectHandler.UpdateProject(w, r)
		case http.MethodDelete:
			projectHandler.DeleteProject(w, r)
		default:
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		}
	})

	// Tag routes
	mux.HandleFunc("/tags/", func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodPost:
			tagHandler.CreateTag(w, r)
		case http.MethodGet:
			if strings.TrimPrefix(r.URL.Path, "/tags/") == "" {
				tagHandler.ListTags(w, r)
			} else {
				tagHandler.GetTag(w, r)
			}
		case http.MethodPut:
			tagHandler.UpdateTag(w, r)
		case http.MethodDelete:
			tagHandler.DeleteTag(w, r)
		default:
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		}
	})

	// Health check
	mux.HandleFunc("/health", healthCheck)

	return mux
}

func healthCheck(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("OK"))
}
