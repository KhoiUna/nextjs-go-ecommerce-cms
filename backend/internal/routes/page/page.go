package pageRoutes

import (
	pageHandler "backend/internal/handler/page"
	"backend/internal/middleware"

	"github.com/gofiber/fiber/v2"
)

func SetupRoutes(router fiber.Router) {
	page := router.Group("/page")

	page.Get("/", pageHandler.GetMenuNavLinks)
	page.Put("/:pageId", middleware.AuthMiddleware, middleware.RoleMiddleware, pageHandler.EditPage)
	page.Delete("/:pageId", middleware.AuthMiddleware, middleware.RoleMiddleware, pageHandler.DeletePage)
	page.Put("/", middleware.AuthMiddleware, middleware.RoleMiddleware, pageHandler.UpdateMenuOrder)
	page.Post("/", middleware.AuthMiddleware, middleware.RoleMiddleware, pageHandler.AddPage)
}
