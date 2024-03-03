package productHandler

import (
	"backend/database"
	session "backend/internal"
	"backend/internal/model"
	"log"

	"github.com/gofiber/fiber/v2"
)

var store = session.Store

type Size struct {
	Size     string `json:"size"`
	Quantity int    `json:"quantity"`
}

func GetProduct(c *fiber.Ctx) error {
	db := database.DB
	productId := c.Params("productId")

	type Image struct {
		Url string `json:"url"`
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

	db.Select("url").Where("item_id = ?", productId).Find(&product.Images)
	db.Table("items").
		Select("color, sizes.type as size, quantity").
		Joins("JOIN colors ON items.id = colors.item_id").
		Joins("JOIN sizes ON colors.id = sizes.color_id").
		Where("items.id = ?", productId).
		Scan(&product.ColorSizeArr)

	return c.JSON(fiber.Map{"hasError": false, "metadata": nil, "errorMessage": "", "payload": &product})
}

func UpdateProduct(c *fiber.Ctx) error {
	session, err := store.Get(c)
	if err != nil {
		log.Fatalf("error getting session store: %v", err)
	}
	db := database.DB
	productId := c.Params("productId")

	type ColorSize struct {
		Color string `json:"color"`
		Sizes []Size `json:"sizes"`
	}
	type Product struct {
		Title         string      `json:"title"`
		PageId        int         `json:"pageId"`
		Brand         string      `json:"brand"`
		Price         float32     `json:"price"`
		Discount      float32     `json:"discount"`
		Discount_type string      `json:"discount_type"`
		Description   string      `json:"description"`
		Material      string      `json:"material"`
		Is_preorder   bool        `json:"isPreorder"`
		Hidden        bool        `json:"hidden"`
		ImageURLs     []string    `json:"imageURLs"`
		ColorSizeArr  []ColorSize `json:"colorSizeArr"`
	}

	product := new(Product)
	if err := c.BodyParser(product); err != nil {
		log.Fatal("invalid input ", err)
		return c.Status(400).JSON(fiber.Map{"hasError": true, "metadata": nil, "errorMessage": "Invalid input", "payload": nil})
	}

	// Check brand, if not exists create a new brand, then return `brands.id`
	brand := new(model.Brand)
	db.Where("name = ?", product.Brand).Find(&brand)
	if brand.ID == 0 {
		brand.Name = product.Brand
		if err := db.Create(&brand).Error; err != nil {
			log.Fatal("error inserting brand ", err)
			return c.Status(500).
				JSON(fiber.Map{"hasError": true, "metadata": nil, "errorMessage": "Internal server error", "payload": nil})
		}
	}

	// Update product in db
	// Create new item
	type Item struct {
		Brand_id      uint    `json:"brand_id"`
		Description   string  `json:"description"`
		Title         string  `json:"title"`
		Price         float32 `json:"price"`
		Discount      float32 `json:"discount"`
		Discount_type string  `json:"discount_type"`
		Is_preorder   int     `json:"is_preorder"`
		Hidden        int     `json:"hidden"`
		Material      string  `json:"material"`
		Page_id       int     `json:"page_id"`
	}
	isPreorder := 0
	if product.Is_preorder {
		isPreorder = 1
	}
	hidden := 0
	if product.Hidden {
		hidden = 1
	}
	var item model.Item
	db.Where("id = ?", productId).Find(&item)

	// Get current session user's `ID`
	userId, userIdOk := session.Get("userId").(uint)
	if !userIdOk {
		return c.Status(403).JSON(fiber.Map{
			"hasError": true, "metadata": nil, "errorMessage": "Internal server error", "payload": nil,
		})
	}

	// Update item with new values, then update in db
	item.Last_edited_by_user_id = userId
	item.Brand_id = brand.ID
	item.Page_id = uint(product.PageId)
	item.Title = product.Title
	item.Description = product.Description
	item.Price = product.Price
	item.Discount = product.Discount
	item.Discount_type = product.Discount_type
	item.Material = product.Material
	item.Hidden = 0
	item.Is_preorder = isPreorder
	item.Hidden = hidden
	if err := db.Save(&item).Error; err != nil {
		log.Fatalf("error updating item: %v \n", err)
		return c.Status(500).
			JSON(fiber.Map{"hasError": true, "metadata": nil, "errorMessage": "Internal server error", "payload": nil})
	}

	// Delete the product's sizes and re-insert to db
	if err := db.Where("item_id = ?", productId).Unscoped().Delete(&model.Size{}).Error; err != nil {
		return c.Status(500).
			JSON(fiber.Map{"hasError": true, "metadata": nil, "errorMessage": "Internal server error", "payload": nil})
	}
	if err := db.Where("item_id = ?", productId).Unscoped().Delete(&model.Color{}).Error; err != nil {
		return c.Status(500).
			JSON(fiber.Map{"hasError": true, "metadata": nil, "errorMessage": "Internal server error", "payload": nil})
	}

	// Re-insert `sizes` & `colors`
	for _, colorSize := range product.ColorSizeArr {
		color := model.Color{Color: colorSize.Color, Item_id: item.ID}
		if err := db.Create(&color).Error; err != nil {
			return c.Status(500).
				JSON(fiber.Map{"hasError": true, "metadata": nil, "errorMessage": "Internal server error", "payload": nil})
		}

		for _, size := range colorSize.Sizes {
			if err := db.Create(&model.Size{
				Item_id:  item.ID,
				Type:     size.Size,
				Quantity: size.Quantity,
				Color_id: color.ID,
			}).Error; err != nil {
				return c.Status(500).
					JSON(fiber.Map{"hasError": true, "metadata": nil, "errorMessage": "Internal server error", "payload": nil})
			}
		}
	}

	// Do the same thing for `images`
	if err := db.Where("item_id = ?", productId).Unscoped().Delete(&model.Image{}).Error; err != nil {
		return c.Status(500).
			JSON(fiber.Map{"hasError": true, "metadata": nil, "errorMessage": "Internal server error", "payload": nil})
	}
	images := []model.Image{}
	for _, url := range product.ImageURLs {
		images = append(images, model.Image{
			Item_id: item.ID,
			Url:     url,
		})
	}
	if err := db.Create(&images).Error; err != nil {
		return c.Status(500).
			JSON(fiber.Map{"hasError": true, "metadata": nil, "errorMessage": "Internal server error", "payload": nil})
	}

	return c.JSON(fiber.Map{"hasError": false, "metadata": nil, "errorMessage": "", "payload": &product})
}

func GetProducts(c *fiber.Ctx) error {
	type Item struct {
		ID                      int     `json:"id"`
		Name                    string  `json:"name"`
		Last_edited_by_username string  `json:"last_edited_by_username"`
		Title                   string  `json:"title"`
		Price                   float32 `json:"price"`
		Discount                float32 `json:"discount"`
		Discount_type           string  `json:"discount_type"`
		Description             string  `json:"description"`
		Material                string  `json:"material"`
		Is_preorder             int     `json:"is_preorder"`
		Hidden                  int     `json:"hidden"`
		Url                     string  `json:"url"`
		Page_id                 uint    `json:"page_id"`
		Slug                    string  `json:"slug"`
		Text                    string  `json:"text"`
	}
	db := database.DB
	brandName := c.Query("brandName")

	var items []Item

	if brandName != "" {
		db.Joins("JOIN brands ON items.brand_id=brands.id").
			Joins("JOIN images ON items.id=images.item_id").
			Joins("JOIN users ON items.last_edited_by_user_id=users.id").
			Joins("LEFT JOIN pages ON pages.id=items.page_id").
			Where("brands.name = ?", brandName).
			Select("items.id, items.title, items.hidden, items.price, images.url, brands.name, items.discount, items.discount_type, users.username as last_edited_by_username, items.page_id, pages.slug, pages.text").
			Group("items.id").
			Order("items.page_id, items.created_at DESC").
			Find(&items)
	} else {
		db.Joins("JOIN brands ON items.brand_id=brands.id").
			Joins("JOIN images ON items.id=images.item_id").
			Joins("JOIN users ON items.last_edited_by_user_id=users.id").
			Joins("LEFT JOIN pages ON pages.id=items.page_id").
			Select("items.id, items.title, items.hidden, items.price, images.url, brands.name, items.discount, items.discount_type, users.username as last_edited_by_username, items.page_id, pages.slug, pages.text").
			Group("items.id").
			Order("items.page_id, items.created_at DESC").
			Find(&items)
	}

	return c.JSON(fiber.Map{"hasError": false, "metadata": nil, "errorMessage": "", "payload": &items})
}

func AddProduct(c *fiber.Ctx) error {
	session, err := store.Get(c)
	if err != nil {
		log.Fatalf("error getting session store: %v", err)
	}
	db := database.DB

	type ColorSize struct {
		Color string `json:"color"`
		Sizes []Size `json:"sizes"`
	}
	type Product struct {
		Title         string      `json:"title"`
		PageId        int         `json:"pageId"`
		Brand         string      `json:"brand"`
		Price         float32     `json:"price"`
		Discount      float32     `json:"discount"`
		Discount_type string      `json:"discount_type"`
		Description   string      `json:"description"`
		Material      string      `json:"material"`
		Is_preorder   bool        `json:"isPreorder"`
		Hidden        bool        `json:"hidden"`
		ImageURLs     []string    `json:"imageURLs"`
		ColorSizeArr  []ColorSize `json:"colorSizeArr"`
	}

	product := new(Product)
	if err := c.BodyParser(product); err != nil {
		log.Fatal("invalid input ", err)
		return c.Status(400).JSON(fiber.Map{"hasError": true, "metadata": nil, "errorMessage": "Invalid input", "payload": nil})
	}

	// Check brand, if not exists create a new brand, then return `brands.id`
	brand := new(model.Brand)
	db.Where("name = ?", product.Brand).Find(&brand)
	if brand.ID == 0 {
		brand.Name = product.Brand
		if err := db.Create(&brand).Error; err != nil {
			log.Fatal("error inserting brand ", err)
			return c.Status(500).
				JSON(fiber.Map{"hasError": true, "metadata": nil, "errorMessage": "Internal server error", "payload": nil})
		}
	}

	// Create new item, then return `items.id`
	type Item struct {
		Brand_id      uint    `json:"brand_id"`
		Description   string  `json:"description"`
		Title         string  `json:"title"`
		Price         float32 `json:"price"`
		Discount      float32 `json:"discount"`
		Discount_type string  `json:"discount_type"`
		Is_preorder   int     `json:"is_preorder"`
		Hidden        int     `json:"hidden"`
		Material      string  `json:"material"`
	}
	isPreorder := 0
	if product.Is_preorder {
		isPreorder = 1
	}
	hidden := 0
	if product.Hidden {
		hidden = 1
	}

	// Get current session's user `ID`
	userId, userIdOk := session.Get("userId").(uint)
	if !userIdOk {
		return c.Status(403).JSON(fiber.Map{
			"hasError": true, "metadata": nil, "errorMessage": "Internal server error", "payload": nil,
		})
	}

	item := model.Item{
		Brand_id:               brand.ID,
		Page_id:                uint(product.PageId),
		Title:                  product.Title,
		Description:            product.Description,
		Price:                  product.Price,
		Discount:               product.Discount,
		Discount_type:          product.Discount_type,
		Material:               product.Material,
		Hidden:                 hidden,
		Is_preorder:            isPreorder,
		Last_edited_by_user_id: userId,
	}
	if err := db.Create(&item).Error; err != nil {
		log.Fatalf("error inserting item: %v \n", err)
		return c.Status(500).
			JSON(fiber.Map{"hasError": true, "metadata": nil, "errorMessage": "Internal server error", "payload": nil})
	}

	// Insert `colors` & `sizes`
	for _, colorSize := range product.ColorSizeArr {
		color := model.Color{Color: colorSize.Color, Item_id: item.ID}
		if err := db.Create(&color).Error; err != nil {
			return c.Status(500).
				JSON(fiber.Map{"hasError": true, "metadata": nil, "errorMessage": "Internal server error", "payload": nil})
		}

		for _, size := range colorSize.Sizes {
			if err := db.Create(&model.Size{
				Item_id:  item.ID,
				Type:     size.Size,
				Quantity: size.Quantity,
				Color_id: color.ID,
			}).Error; err != nil {
				return c.Status(500).
					JSON(fiber.Map{"hasError": true, "metadata": nil, "errorMessage": "Internal server error", "payload": nil})
			}
		}
	}

	// Insert `images`
	images := []model.Image{}
	for _, url := range product.ImageURLs {
		images = append(images, model.Image{
			Item_id: item.ID,
			Url:     url,
		})
	}
	if err := db.Create(&images).Error; err != nil {
		return c.Status(500).
			JSON(fiber.Map{"hasError": true, "metadata": nil, "errorMessage": "Internal server error", "payload": nil})
	}

	return c.JSON(fiber.Map{"hasError": false, "metadata": nil, "errorMessage": "", "payload": &product})
}

func DeleteProduct(c *fiber.Ctx) error {
	db := database.DB
	productId := c.Params("productId")

	if err := db.Unscoped().Delete(&model.Item{}, productId).Error; err != nil {
		return c.Status(500).
			JSON(fiber.Map{"hasError": true, "metadata": nil, "errorMessage": "Internal server error", "payload": nil})
	}

	if err := db.Unscoped().Where("item_id = ?", productId).Delete(&model.Color{}).Error; err != nil {
		return c.Status(500).
			JSON(fiber.Map{"hasError": true, "metadata": nil, "errorMessage": "Internal server error", "payload": nil})
	}
	if err := db.Unscoped().Where("item_id = ?", productId).Delete(&model.Size{}).Error; err != nil {
		return c.Status(500).
			JSON(fiber.Map{"hasError": true, "metadata": nil, "errorMessage": "Internal server error", "payload": nil})
	}

	return c.JSON(fiber.Map{"hasError": false, "metadata": nil, "errorMessage": "", "payload": nil})
}
