package database

import (
	"backend/internal/model"
	"fmt"

	_ "github.com/mattn/go-sqlite3"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB

func ConnectDB() {
	var err error
	DB, err = gorm.Open(sqlite.Open("StoreDb.db"), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})
	if err != nil {
		panic("failed to connect database")
	}
	fmt.Println("Database connected successfully.")

	// Migrate the database
	migrateErr := DB.AutoMigrate(
		&model.Brand{},
		&model.Item{},
		&model.Image{},
		&model.Color{},
		&model.Size{},
		&model.User{},
		&model.Preorder{},
		&model.Page{},
		&model.Site{},
	)
	if migrateErr != nil {
		panic(migrateErr.Error())
	}

	// Pre-populate database
	DB.FirstOrCreate(&model.Site{Image_url: ""})
	DB.FirstOrCreate(&model.Page{Slug: "pre-orders", Text: "Pre Orders", Is_Permanent: 1, Order: 1})

	fmt.Println("Database migrated.")
}
