package siteRoutes

import (
	siteHandler "backend/internal/handler/site"
	"backend/internal/middleware"

	"github.com/gofiber/fiber/v2"
)

func SetupRoutes(router fiber.Router) {
	site := router.Group("/site")

	site.Get("/", siteHandler.GetSite)
	site.Put("/", middleware.AuthMiddleware, middleware.RoleMiddleware, siteHandler.EditSite)
}
