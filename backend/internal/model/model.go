package model

import "gorm.io/gorm"

type Brand struct {
	gorm.Model
	Name string `json:"name" gorm:"unique"`
}

type Item struct {
	gorm.Model
	Title                  string  `json:"title"`
	Price                  float32 `json:"price"`
	Discount               float32 `json:"discount"`
	Discount_type          string  `json:"discount_type"`
	Description            string  `json:"description"`
	Material               string  `json:"material"`
	Is_preorder            int     `json:"is_preorder"`
	Hidden                 int     `json:"hidden"`
	Last_edited_by_user_id uint    `json:"last_edited_by_user_id"`
	Images                 []Image `json:"images"`
	Colors                 []Color `json:"colors"`
	Sizes                  []Size  `json:"sizes"`
	Brand_id               uint    `json:"brand_id"`
	Brand                  Brand
	Preorders              []Preorder
	Page                   Page
	Page_id                uint `json:"page_id"`
}

type Image struct {
	gorm.Model
	Url     string `json:"url"`
	Item_id uint   `json:"item_id"`
	Item    Item
}

type Size struct {
	gorm.Model
	Type     string `json:"type"`
	Quantity int    `json:"quantity"`
	Item_id  uint   `json:"item_id"`
	Item     Item
	Color_id uint `json:"color_id"`
	Color    Color
}

type Color struct {
	gorm.Model
	Color   string `json:"color"`
	Item_id uint   `json:"item_id"`
	Item    Item
}

type User struct {
	gorm.Model
	Username string `json:"username" gorm:"unique"`
	Password string `json:"password"`
	Role     string `json:"role"`
}

type Preorder struct {
	gorm.Model
	Customer_name string `json:"customer_name"`
	Social        string `json:"social"`
	Size          string `json:"size"`
	Color         string `json:"color"`
	Completed     int    `json:"completed"     gorm:"default:0"`
	Item_id       uint   `json:"item_id"`
	Item          Item
}

type Page struct {
	gorm.Model
	Slug         string `json:"slug"         gorm:"unique"`
	Text         string `json:"text"`
	Order        int    `json:"order"`
	Is_Permanent int    `json:"is_permanent"`
}

type Site struct {
	gorm.Model
	Image_url string `json:"image_url"`
}
