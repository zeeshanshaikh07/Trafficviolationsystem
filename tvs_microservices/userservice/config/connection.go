package config

import (
	"fmt"
	"log"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

func SetupDBConnection() *gorm.DB {

	conf := NewConfig() //Initialize config
	dbUser := conf.Database.User
	dbPass := conf.Database.Password
	dbName := conf.Database.Dbname
	dbHost := conf.Database.Host

	dsn := fmt.Sprintf("%s:%s@tcp(%s)/%s?charset=utf8mb4&parseTime=True&loc=Local", dbUser, dbPass, dbHost, dbName)
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})

	if err != nil {
		panic("Failed to connect to database")
	}
	log.Println("Successfully connected to database...!!!")

	//migrating defined modals to DB table
	//db.AutoMigrate(&modal.Book{}, &modal.Author{})
	return db

}

func CloseDBConnection(db *gorm.DB) {
	dbMySql, err := db.DB()
	if err != nil {
		panic("Failed to close connection.")
	}

	dbMySql.Close()
}
