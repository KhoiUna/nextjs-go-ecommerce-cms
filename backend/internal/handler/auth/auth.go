package authHandler

import (
	"backend/database"
	session "backend/internal"
	"backend/internal/model"
	"log"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
)

var store = session.Store

func GetUser(c *fiber.Ctx) error {
	session, err := store.Get(c)
	if err != nil {
		log.Fatalf("error getting session store: %v", err)
	}

	type Resp struct {
		Username        string `json:"username"`
		Role            string `json:"role"`
		IsAuthenticated bool   `json:"isAuthenticated"`
	}
	var resp Resp
	isAuthenticated, ok := session.Get("isAuthenticated").(bool)
	if !ok {
		return c.Status(403).
			JSON(fiber.Map{"hasError": true, "metadata": nil, "errorMessage": "Not authenticated", "payload": &resp})
	}
	username, usernameOk := session.Get("username").(string)
	if !usernameOk {
		return c.Status(403).
			JSON(fiber.Map{"hasError": true, "metadata": nil, "errorMessage": "Not authenticated", "payload": &resp})
	}
	role, roleOk := session.Get("role").(string)
	if !roleOk {
		return c.Status(403).
			JSON(fiber.Map{"hasError": true, "metadata": nil, "errorMessage": "Not authenticated", "payload": &resp})
	}

	resp.Username = username
	resp.Role = role
	resp.IsAuthenticated = isAuthenticated
	return c.JSON(fiber.Map{"hasError": false, "metadata": nil, "payload": &resp})
}

func HandleLogin(c *fiber.Ctx) error {
	var err error
	db := database.DB

	session, err := store.Get(c)
	if err != nil {
		panic(err)
	}

	type LoginInput struct {
		Username string `json:"username" validate:"required,min=3,max=10"`
		Password string `json:"password" validate:"required,min=5"`
	}
	loginInput := new(LoginInput)

	if err = c.BodyParser(loginInput); err != nil {
		return c.Status(400).JSON(fiber.Map{"hasError": true, "metadata": nil, "errorMessage": "Invalid input", "payload": nil})
	}

	validate := validator.New()
	err = validate.Struct(loginInput)
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"hasError": true, "metadata": nil, "errorMessage": "Invalid input", "payload": nil})
	}

	// Check username
	var user model.User
	db.Where("username = ?", loginInput.Username).Find(&user)

	// Check valid password
	if !ComparePassword(user.Password, loginInput.Password) {
		return c.Status(403).
			JSON(fiber.Map{"hasError": true, "errorMessage": "Invalid username or password", "metadata": nil, "payload": nil})
	}

	if session.Fresh() {
		session.Set("isAuthenticated", true)
		session.Set("username", user.Username)
		session.Set("role", user.Role)
		session.Set("userId", user.ID)
		if err = session.Save(); err != nil {
			return c.Status(500).
				JSON(fiber.Map{"hasError": true, "errorMessage": "Internal server error", "metadata": nil, "payload": nil})
		}
	}

	type Resp struct {
		IsAuthenticated bool   `json:"isAuthenticated"`
		Username        string `json:"username"`
		Role            string `json:"role"`
	}
	resp := Resp{IsAuthenticated: true, Username: user.Username, Role: user.Role}
	return c.JSON(fiber.Map{"hasError": false, "metadata": nil, "payload": &resp})
}

func HandleLogout(c *fiber.Ctx) error {
	session, err := store.Get(c)
	if err != nil {
		panic(err)
	}

	type Resp struct {
		IsAuthenticated bool `json:"isAuthenticated"`
	}
	var resp Resp
	isAuthenticated, ok := session.Get("isAuthenticated").(bool)
	if !isAuthenticated || !ok {
		return c.Status(401).
			JSON(fiber.Map{"hasError": true, "metadata": nil, "errorMessage": "Not authenticated", "payload": &resp})
	}

	if err := session.Destroy(); err != nil {
		return c.Status(500).
			JSON(fiber.Map{"hasError": true, "errorMessage": "Internal server error", "metadata": nil, "payload": &resp})
	}

	resp.IsAuthenticated = true
	return c.JSON(fiber.Map{"hasError": false, "metadata": nil, "payload": &resp})
}
