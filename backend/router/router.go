package router

import (
	authRoutes "backend/internal/routes/auth"
	brandRoutes "backend/internal/routes/brand"
	pageRoutes "backend/internal/routes/page"
	preorderRoutes "backend/internal/routes/preorder"
	productRoutes "backend/internal/routes/product"
	siteRoutes "backend/internal/routes/site"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/logger"
)

func SetupRoutes(app *fiber.App) {
	api := app.Group("/api", logger.New())

	api.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("hi world!\n")
	})

	pageRoutes.SetupRoutes(api)
	preorderRoutes.SetupPreorderRoutes(api)
	brandRoutes.SetupBrandRoutes(api)
	authRoutes.SetupAuthRoutes(api)
	productRoutes.SetupProductRoutes(api)
	siteRoutes.SetupRoutes(api)
}
