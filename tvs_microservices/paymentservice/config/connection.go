package config

import (
	"fmt"
	"log"

	"github.com/KadirSheikh/tvs_utils/utils"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

func SetupDBConnection(conf *utils.Config) *gorm.DB {

	dbUser := conf.Database.User
	dbPass := conf.Database.Password
	dbName := conf.Database.Database
	dbHost := conf.Database.Host

	dsn := fmt.Sprintf("%s:%s@tcp(%s)/%s?charset=utf8mb4&parseTime=True&loc=Local", dbUser, dbPass, dbHost, dbName)
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Println("Failed to connect to database")
	}
	log.Println("Successfully connected to database...!!!")
	return db

}

func CloseDBConnection(db *gorm.DB) {
	dbMySql, err := db.DB()
	if err != nil {
		log.Println("Failed to close connection.")
	}

	dbMySql.Close()
}
