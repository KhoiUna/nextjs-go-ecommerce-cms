package session

import (
	"time"

	"github.com/gofiber/fiber/v2/middleware/session"
	"github.com/gofiber/storage/sqlite3/v2"
)

var Store = session.New(session.Config{
	Storage: sqlite3.New(sqlite3.Config{
		Database: "./fiber_session.db",
		Table:    "sessions",
	}),
	Expiration: time.Hour, // Expires after 1 hour
})
