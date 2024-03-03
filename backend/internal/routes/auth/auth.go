package authRoutes

import (
	authHandler "backend/internal/handler/auth"
	"backend/internal/middleware"

	"github.com/gofiber/fiber/v2"
)

func SetupAuthRoutes(router fiber.Router) {
	auth := router.Group("/auth")

	auth.Get("/", authHandler.GetUser)
	auth.Post("/login", authHandler.HandleLogin)
	auth.Post("/logout", middleware.AuthMiddleware, authHandler.HandleLogout)
}
