package db

import (
	"fmt"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"trafficsystem.com/vehicleregistrationservice/helper"
)

func InitializeDbConnection(dbConf *helper.Config) (Connector *gorm.DB) {
	connectionString := getConnectionString(dbConf)
	fmt.Println("Connection string ", connectionString)
	db := connectDB(connectionString)
	return db
}

var getConnectionString = func(config *helper.Config) string {

	connectionString := fmt.Sprintf("%s:%s@tcp(%s)/%s?charset=utf8mb4&collation=utf8mb4_unicode_ci&parseTime=true&multiStatements=true",
		config.Db.User, config.Db.Password, config.Db.Server, config.Db.Name)

	return connectionString
}

func connectDB(connectString string) (conn *gorm.DB) {

	conn, err := gorm.Open(mysql.Open(connectString), &gorm.Config{})
	if err != nil {
		panic("Could not connect to database")
	}

	fmt.Println("Connection is successfull")
	return conn
}
