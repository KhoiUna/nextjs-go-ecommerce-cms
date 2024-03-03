package preorderRoutes

import (
	preorderHandler "backend/internal/handler/preorder"
	"backend/internal/middleware"

	"github.com/gofiber/fiber/v2"
)

func SetupPreorderRoutes(router fiber.Router) {
	product := router.Group("/preorder")

	product.Get("/", middleware.AuthMiddleware, preorderHandler.GetPreorders)
	product.Post("/", preorderHandler.AddPreorder)
	product.Put("/complete/:preorderId", middleware.AuthMiddleware, preorderHandler.CompletePreorder)
}
