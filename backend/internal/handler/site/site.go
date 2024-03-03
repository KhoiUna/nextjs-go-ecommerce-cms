package siteHandler

import (
	"backend/database"
	session "backend/internal"
	"backend/internal/model"

	"github.com/gofiber/fiber/v2"
)

var store = session.Store

func GetSite(c *fiber.Ctx) error {
	db := database.DB

	var site model.Site
	db.First(&site)

	return c.JSON(fiber.Map{"hasError": false, "metadata": nil, "errorMessage": "", "payload": &site})
}

func EditSite(c *fiber.Ctx) error {
	db := database.DB

	type Body struct {
		ImageUrl string `json:"imageUrl"`
	}
	body := new(Body)
	if err := c.BodyParser(body); err != nil {
		return c.Status(400).JSON(fiber.Map{"hasError": true, "metadata": nil, "errorMessage": "Invalid input", "payload": nil})
	}

	var site model.Site
	db.First(&site)
	site.Image_url = body.ImageUrl
	if err := db.Save(&site).Error; err != nil {
		return c.Status(500).
			JSON(fiber.Map{"hasError": true, "metadata": nil, "errorMessage": "Internal server error", "payload": nil})
	}

	return c.JSON(fiber.Map{"hasError": false, "metadata": nil, "errorMessage": "", "payload": nil})
}
