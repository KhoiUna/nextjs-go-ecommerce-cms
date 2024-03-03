package brandRoutes

import (
	brandHandler "backend/internal/handler/brand"

	"github.com/gofiber/fiber/v2"
)

func SetupBrandRoutes(router fiber.Router) {
	brand := router.Group("/brand")

	brand.Get("/", brandHandler.GetBrands)
	brand.Get("/preorder", brandHandler.GetPreorders)
	brand.Get("/sales", brandHandler.GetSales)
	brand.Get("/all", brandHandler.GetAllItems)
	brand.Get("/:pageSlug", brandHandler.GetItemsByPageSlug)
	brand.Get("/item/:itemId", brandHandler.GetItem)
}
