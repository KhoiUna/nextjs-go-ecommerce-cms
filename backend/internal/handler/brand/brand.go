package brandHandler

import (
	"backend/database"
	"backend/internal/model"

	"github.com/gofiber/fiber/v2"
)

func GetBrands(c *fiber.Ctx) error {
	db := database.DB
	var brands []model.Brand

	db.Find(&brands)

	return c.JSON(fiber.Map{"hasError": false, "metadata": nil, "errorMessage": "", "payload": brands})
}

func GetAllItems(c *fiber.Ctx) error {
	type Item struct {
		ID            int     `json:"id"`
		Title         string  `json:"title"`
		Price         float32 `json:"price"`
		Discount      float32 `json:"discount"`
		Discount_type string  `json:"discount_type"`
		Description   string  `json:"description"`
		Material      string  `json:"material"`
		Is_preorder   int     `json:"is_preorder"`
		Hidden        int     `json:"hidden"`
		Url           string  `json:"url"`
	}
	db := database.DB

	var items []Item
	db.Joins("JOIN brands ON items.brand_id=brands.id").
		Joins("JOIN images ON items.id=images.item_id").
		Where("items.hidden = ?", 0).
		Where("items.is_preorder= ?", 0).
		Select("items.id, items.title, items.price, items.discount, items.discount_type, images.url").
		Group("items.id").
		Order("items.created_at DESC").
		Find(&items)

	return c.JSON(fiber.Map{"hasError": false, "metadata": nil, "errorMessage": "", "payload": items})
}

func GetPreorders(c *fiber.Ctx) error {
	type Item struct {
		ID            int     `json:"id"`
		Title         string  `json:"title"`
		Price         float32 `json:"price"`
		Discount      float32 `json:"discount"`
		Discount_type string  `json:"discount_type"`
		Description   string  `json:"description"`
		Material      string  `json:"material"`
		Is_preorder   int     `json:"is_preorder"`
		Hidden        int     `json:"hidden"`
		Url           string  `json:"url"`
	}
	db := database.DB

	var items []Item
	db.Joins("JOIN brands ON items.brand_id=brands.id").
		Joins("JOIN images ON items.id=images.item_id").
		Where("items.is_preorder = ?", 1).
		Where("items.hidden = ?", 0).
		Select("items.id, items.title, items.price, items.discount, items.discount_type, images.url").
		Group("items.id").
		Order("items.created_at DESC").
		Find(&items)

	return c.JSON(fiber.Map{"hasError": false, "metadata": nil, "errorMessage": "", "payload": items})
}

func GetSales(c *fiber.Ctx) error {
	type Item struct {
		ID            int     `json:"id"`
		Title         string  `json:"title"`
		Price         float32 `json:"price"`
		Discount      float32 `json:"discount"`
		Discount_type string  `json:"discount_type"`
		Description   string  `json:"description"`
		Material      string  `json:"material"`
		Is_preorder   int     `json:"is_preorder"`
		Hidden        int     `json:"hidden"`
		Url           string  `json:"url"`
	}
	db := database.DB

	var items []Item
	db.Joins("JOIN brands ON items.brand_id=brands.id").
		Joins("JOIN images ON items.id=images.item_id").
		Where("items.discount > ?", 0).
		Where("items.hidden = ?", 0).
		Select("items.id, items.title, items.price, items.discount, items.discount_type, images.url").
		Group("items.id").
		Order("items.created_at DESC").
		Find(&items)

	return c.JSON(fiber.Map{"hasError": false, "metadata": nil, "errorMessage": "", "payload": items})
}

func GetItemsByPageSlug(c *fiber.Ctx) error {
	type Item struct {
		ID            int     `json:"id"`
		Title         string  `json:"title"`
		Price         float32 `json:"price"`
		Discount      float32 `json:"discount"`
		Discount_type string  `json:"discount_type"`
		Description   string  `json:"description"`
		Material      string  `json:"material"`
		Is_preorder   int     `json:"is_preorder"`
		Hidden        int     `json:"hidden"`
		Url           string  `json:"url"`
	}
	db := database.DB
	pageSlug := c.Params("pageSlug")

	var items []Item
	db.Joins("JOIN brands ON items.brand_id=brands.id").
		Joins("JOIN images ON items.id=images.item_id").
		Joins("JOIN pages ON items.page_id=pages.id").
		Where("pages.slug = ?", pageSlug).
		Where("items.hidden = ?", 0).
		Select("items.id, items.title, items.price, items.discount, items.discount_type, images.url").
		Group("items.id").
		Order("items.created_at DESC").
		Find(&items)

	return c.JSON(fiber.Map{"hasError": false, "metadata": nil, "errorMessage": "", "payload": items})
}

func GetItem(c *fiber.Ctx) error {
	db := database.DB
	productId := c.Params("itemId")

	type Image struct {
		Url string `json:"url"`
	}
	type Size struct {
		Size     string `json:"size"`
		Quantity int    `json:"quantity"`
	}
	type ColorSize struct {
		Size
		Color string `json:"color"`
	}
	type Product struct {
		ID                      uint        `json:"id"`
		Page_id                 uint        `json:"page_id"`
		Last_edited_by_username string      `json:"last_edited_by_username"`
		Title                   string      `json:"title"`
		Price                   float32     `json:"price"`
		Discount                float32     `json:"discount"`
		Discount_type           string      `json:"discount_type"`
		Description             string      `json:"description"`
		Material                string      `json:"material"`
		Is_preorder             int         `json:"is_preorder"`
		Hidden                  int         `json:"hidden"`
		Images                  []Image     `json:"images"`
		Name                    string      `json:"name"`
		ColorSizeArr            []ColorSize `json:"color_size_arr"`
	}

	var product Product
	db.Table("items").Joins("JOIN brands ON items.brand_id = brands.id").
		Joins("JOIN users ON items.last_edited_by_user_id=users.id").
		Select("items.id, items.discount, items.discount_type, items.description, items.title, items.price, items.material, items.is_preorder, items.hidden, brands.name, users.username as last_edited_by_username, items.page_id").
		Where("items.id = ?", productId).
		Scan(&product)

	if product.ID == 0 {
		return c.Status(404).
			JSON(fiber.Map{"hasError": true, "metadata": nil, "errorMessage": "Item not found", "payload": nil})
	}

	db.Table("images").Select("url").Where("item_id = ?", productId).Scan(&product.Images)
	db.Table("items").
		Select("color, sizes.type as size, quantity").
		Joins("JOIN colors ON items.id = colors.item_id").
		Joins("JOIN sizes ON colors.id = sizes.color_id").
		Where("items.id = ?", productId).
		Scan(&product.ColorSizeArr)

	return c.JSON(fiber.Map{"hasError": false, "metadata": nil, "errorMessage": "", "payload": product})
}
