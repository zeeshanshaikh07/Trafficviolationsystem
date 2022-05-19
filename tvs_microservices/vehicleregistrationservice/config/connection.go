package config

import (
	"fmt"

	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/mysql"
	_ "gorm.io/gorm"
	"trafficsystem.com/vehicleregistrationservice/utils"
)

func InitializeDbConnection(dbConf *utils.Config) (Connector *gorm.DB) {
	connectionString := getConnectionString(dbConf)
	fmt.Println("Connection string ", connectionString)
	db := connectDB(connectionString)
	return db
}

var getConnectionString = func(config *utils.Config) string {

	return fmt.Sprintf("%s:%s@tcp(%s)/%s?charset=utf8mb4&collation=utf8mb4_unicode_ci&parseTime=true&multiStatements=true",
		config.Db.User, config.Db.Password, config.Db.Server, config.Db.Name)

}

func connectDB(connectString string) (conn *gorm.DB) {

	conn, err := gorm.Open("mysql", connectString)
	if err != nil {
		fmt.Println(err)
		panic("Could not connect to database")
	}

	conn.SingularTable(true)
	fmt.Println("Connection is successfull")
	return conn
}

func CloseDB(conn *gorm.DB) {
	conn.DB().Close()
}
