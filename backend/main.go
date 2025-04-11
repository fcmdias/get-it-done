package main

import (
	"log"
	"net/http"

	"github.com/fcmdias/get-it-done/backend/config"
	"github.com/fcmdias/get-it-done/backend/models"
	"github.com/fcmdias/get-it-done/backend/routes"
)

func main() {
	log.Println("Starting server...")

	// Initialize database
	dbConfig, err := config.NewDatabaseConfig()
	if err != nil {
		log.Fatal("Failed to load database config:", err)
	}

	db, err := dbConfig.ConnectDatabase()
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	// Get underlying SQL DB to close it later
	sqlDB, err := db.DB()
	if err != nil {
		log.Fatal("Failed to get database instance:", err)
	}
	defer sqlDB.Close()

	// Auto migrate database models
	if err := models.AutoMigrate(db); err != nil {
		log.Fatal("Failed to migrate database:", err)
	}

	// Initialize router with database connection
	router := routes.NewRouter(db)

	// Start server with CORS middleware
	log.Printf("Server starting on :8080")
	log.Fatal(http.ListenAndServe(":8080", setupCORS(router.SetupRoutes())))
}

func setupRoutes() http.Handler {
	// TODO: Setup routes
	return http.NewServeMux()
}

func setupCORS(handler http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*") // In production, replace * with your frontend domain
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		handler.ServeHTTP(w, r)
	})
}
