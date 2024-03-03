package preorderHandler

import (
	"backend/database"
	_ "backend/database"
	session "backend/internal"
	"backend/internal/model"
	_ "backend/internal/model"
	"bytes"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/gofiber/fiber/v2"
)

var store = session.Store

func GetPreorders(c *fiber.Ctx) error {
	db := database.DB

	type Preorder struct {
		Created_at    time.Time `json:"created_at"`
		Customer_name string    `json:"customer_name"`
		Social        string    `json:"social"`
		Size          string    `json:"size"`
		Color         string    `json:"color"`
		Url           string    `json:"image_url"`
		Title         string    `json:"title"`
		Completed     int       `json:"completed"`
		Item_id       uint      `json:"item_id"`
		Id            uint      `json:"id"`
	}
	var preorders []Preorder
	db.Table("preorders").Joins("JOIN items ON items.id=preorders.item_id").
		Joins("JOIN images ON images.item_id=items.id").
		Select("preorders.id, preorders.created_at, images.url, customer_name, social, size, items.title, items.id as item_id, preorders.completed, preorders.color").
		Order("preorders.created_at DESC").
		Group("items.id, preorders.id").
		Scan(&preorders)

	return c.JSON(fiber.Map{"hasError": false, "metadata": nil, "errorMessage": "", "payload": preorders})
}

func AddPreorder(c *fiber.Ctx) error {
	db := database.DB
	type Body struct {
		Name   string `json:"name"`
		Social string `json:"social"`
		Size   string `json:"size"`
		Color  string `json:"color"`
		ItemId string `json:"itemId"`
	}
	var body Body
	if err := c.BodyParser(&body); err != nil {
		log.Fatalf("invalid input %v \n", err)
		return c.Status(400).JSON(fiber.Map{"hasError": true, "metadata": nil, "errorMessage": "Invalid input", "payload": nil})
	}

	// Insert `preorder` to db
	itemId, _ := strconv.Atoi(body.ItemId)
	preorder := model.Preorder{
		Customer_name: body.Name,
		Social:        body.Social,
		Size:          body.Size,
		Color:         body.Color,
		Item_id:       uint(itemId),
	}
	if err := db.Create(&preorder).Error; err != nil {
		return c.Status(500).
			JSON(fiber.Map{"hasError": true, "metadata": nil, "errorMessage": "Internal server error", "payload": nil})
	}

	var item model.Item
	db.Where("id = ?", preorder.Item_id).Find(&item)

	// Send notification to Discord
	DISCORD_WEBHOOK_URL := os.Getenv("DISCORD_WEBHOOK_URL")
	content := fmt.Sprintf(
		"-----\n**NEW PREORDER** for _%s_\n**NAME:** %s\n**SOCIAL:** %s\n**SIZE:** %s\n**COLOR:** %s\n-----",
		item.Title,
		preorder.Customer_name,
		preorder.Social,
		preorder.Size,
		preorder.Color,
	)
	data := map[string]string{"content": content}
	jsonData, _ := json.Marshal(data)

	resp, err := http.Post(DISCORD_WEBHOOK_URL, "application/json", bytes.NewBuffer(jsonData))
	if err != nil {
		log.Fatal(err)
	}
	defer resp.Body.Close()

	return c.JSON(fiber.Map{"hasError": false, "metadata": nil, "errorMessage": "", "payload": body})
}

func CompletePreorder(c *fiber.Ctx) error {
	db := database.DB
	preorderId := c.Params("preorderId")

	if err := db.Model(&model.Preorder{}).Where("id = ?", preorderId).Update("completed", 1).Error; err != nil {
		return c.Status(500).
			JSON(fiber.Map{"hasError": true, "metadata": nil, "errorMessage": "Internal server error", "payload": nil})
	}

	return c.JSON(fiber.Map{"hasError": false, "metadata": nil, "errorMessage": "", "payload": nil})
}
