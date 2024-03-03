package pageHandler

import (
	"backend/database"
	session "backend/internal"
	"backend/internal/model"

	"github.com/gofiber/fiber/v2"
)

var store = session.Store

func GetMenuNavLinks(c *fiber.Ctx) error {
	db := database.DB
	var links []model.Page

	db.Order("`order` ASC").Select("id, slug, text, is_permanent, `order`").Find(&links)

	return c.JSON(fiber.Map{"hasError": false, "metadata": nil, "errorMessage": "", "payload": links})
}

func UpdateMenuOrder(c *fiber.Ctx) error {
	db := database.DB

	type MenuItem struct {
		ID    int    `json:"id"`
		Order int    `json:"order"`
		Slug  string `json:"slug"`
		Text  string `json:"text"`
	}
	type Body struct {
		MenuItems []MenuItem `json:"menuItems"`
	}
	body := new(Body)
	if err := c.BodyParser(body); err != nil {
		return c.Status(400).JSON(fiber.Map{"hasError": true, "metadata": nil, "errorMessage": "Invalid input", "payload": nil})
	}

	// Loop through body and update the pages.`order` in db
	for order, item := range body.MenuItems {
		var page model.Page
		db.Where("id = ?", item.ID).First(&page)
		page.Order = order + 1

		if err := db.Save(&page).Error; err != nil {
			return c.Status(500).
				JSON(fiber.Map{"hasError": true, "metadata": nil, "errorMessage": "Internal server error", "payload": nil})
		}
	}

	return c.JSON(fiber.Map{"hasError": false, "metadata": nil, "errorMessage": "", "payload": body})
}

func AddPage(c *fiber.Ctx) error {
	db := database.DB

	type Body struct {
		Text string `json:"text"`
		Slug string `json:"slug"`
	}
	body := new(Body)
	if err := c.BodyParser(body); err != nil {
		return c.Status(400).JSON(fiber.Map{"hasError": true, "metadata": nil, "errorMessage": "Invalid input", "payload": nil})
	}

	var page model.Page
	db.Where("slug = ?", body.Slug).Find(&page)
	if page.ID != 0 {
		return c.Status(400).
			JSON(fiber.Map{"hasError": true, "metadata": nil, "errorMessage": "Slug already exists", "payload": nil})
	}

	var lastOrderedPage model.Page
	db.Find(&lastOrderedPage).Order("`order` DESC").Limit(1)

	page = model.Page{
		Text:  body.Text,
		Slug:  body.Slug,
		Order: lastOrderedPage.Order + 1,
	}
	if err := db.Create(&page).Error; err != nil {
		return c.Status(500).
			JSON(fiber.Map{"hasError": true, "metadata": nil, "errorMessage": "Internal server error", "payload": nil})
	}

	return c.JSON(fiber.Map{"hasError": false, "metadata": nil, "errorMessage": "", "payload": page})
}

func DeletePage(c *fiber.Ctx) error {
	db := database.DB

	pageId := c.Params("pageId")

	var page model.Page
	db.Where("id = ?", pageId).Find(&page)
	if page.Is_Permanent == 1 {
		return c.Status(400).
			JSON(fiber.Map{"hasError": true, "metadata": nil, "errorMessage": "This page cannot be deleted", "payload": nil})
	}

	if err := db.Unscoped().Delete(&model.Page{}, pageId).Error; err != nil {
		return c.Status(500).
			JSON(fiber.Map{"hasError": true, "metadata": nil, "errorMessage": "Internal server error", "payload": nil})
	}

	return c.JSON(fiber.Map{"hasError": false, "metadata": nil, "errorMessage": "", "payload": nil})
}

func EditPage(c *fiber.Ctx) error {
	db := database.DB
	pageId := c.Params("pageId")

	type Body struct {
		Text string `json:"text"`
		Slug string `json:"slug"`
	}
	body := new(Body)
	if err := c.BodyParser(body); err != nil {
		return c.Status(400).JSON(fiber.Map{"hasError": true, "metadata": nil, "errorMessage": "Invalid input", "payload": nil})
	}

	var page model.Page
	db.Where("id = ?", pageId).Find(&page)
	if page.Is_Permanent == 1 {
		return c.Status(400).
			JSON(fiber.Map{"hasError": true, "metadata": nil, "errorMessage": "This page cannot be edited", "payload": nil})
	}

	var checkDuplicatedSlug model.Page
	db.Where("slug = ?", body.Slug).Where("id <> ?", pageId).Find(&checkDuplicatedSlug)
	if checkDuplicatedSlug.ID != 0 {
		return c.Status(400).
			JSON(fiber.Map{"hasError": true, "metadata": nil, "errorMessage": "Slug already exists", "payload": nil})
	}

	page.Slug = body.Slug
	page.Text = body.Text
	if err := db.Save(&page).Error; err != nil {
		return c.Status(500).
			JSON(fiber.Map{"hasError": true, "metadata": nil, "errorMessage": "Internal server error", "payload": nil})
	}

	return c.JSON(fiber.Map{"hasError": false, "metadata": nil, "errorMessage": "", "payload": nil})
}
