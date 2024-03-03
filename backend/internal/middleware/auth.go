package middleware

import (
	session "backend/internal"

	"github.com/gofiber/fiber/v2"
)

var store = session.Store

func AuthMiddleware(c *fiber.Ctx) error {
	session, err := store.Get(c)
	if err != nil {
		panic(err)
	}

	if session.Get("isAuthenticated") != nil {
		return c.Next()
	} else {
		return c.Status(403).
			JSON(fiber.Map{"hasError": true, "metadata": nil, "errorMessage": "Not authenticated", "payload": nil})
	}
}

func RoleMiddleware(c *fiber.Ctx) error {
	session, err := store.Get(c)
	if err != nil {
		panic(err)
	}

	if session.Get("role") == "admin" {
		return c.Next()
	} else {
		return c.Status(403).
			JSON(fiber.Map{"hasError": true, "metadata": nil, "errorMessage": "Unauthorized action", "payload": nil})
	}
}
