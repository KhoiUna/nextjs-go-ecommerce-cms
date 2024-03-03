package productRoutes

import (
	productHandler "backend/internal/handler/product"
	"backend/internal/middleware"

	"github.com/gofiber/fiber/v2"
)

func SetupProductRoutes(router fiber.Router) {
	product := router.Group("/product")

	product.Get("/", middleware.AuthMiddleware, productHandler.GetProducts)
	product.Post("/", middleware.AuthMiddleware, productHandler.AddProduct)
	product.Get("/:productId", middleware.AuthMiddleware, productHandler.GetProduct)
	product.Put("/:productId", middleware.AuthMiddleware, middleware.RoleMiddleware, productHandler.UpdateProduct)
	product.Delete("/:productId", middleware.AuthMiddleware, middleware.RoleMiddleware, productHandler.DeleteProduct)
}
