package main

import (
	"backend/database"
	"backend/router"
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/basicauth"
	"github.com/gofiber/fiber/v2/middleware/compress"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/encryptcookie"
	"github.com/gofiber/fiber/v2/middleware/helmet"
	"github.com/gofiber/fiber/v2/middleware/monitor"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatal("error loading .env file")
	}

	app := fiber.New()

	app.Use(helmet.New())
	app.Use(compress.New(compress.Config{
		Level: compress.LevelBestSpeed, // Best compression speed: 1
	}))

	// CORS
	app.Use(cors.New(cors.Config{
		AllowOrigins:     os.Getenv("APP_URL"),
		AllowCredentials: true,
	}))

	// Cookies
	app.Use(encryptcookie.New(encryptcookie.Config{
		Key: os.Getenv("COOKIE_SECRET"),
	}))

	// Metrics
	app.Use("/metrics", basicauth.New(basicauth.Config{
		Users: map[string]string{
			os.Getenv("METRICS_USERNAME"): os.Getenv("METRICS_PASSWORD"),
		},
	}))
	app.Get("/metrics", monitor.New(monitor.Config{Title: "Backend Metrics"}))

	// Connect DB
	database.ConnectDB()

	router.SetupRoutes(app)

	log.Fatal(app.Listen(":" + os.Getenv("PORT")))
}
