package config

import (
	"fmt"

	"github.com/KadirSheikh/tvs_utils/utils"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/mysql"
	_ "gorm.io/gorm"
)

func InitializeDbConnection(dbConf *utils.Config) (Connector *gorm.DB) {
	connectionString := getConnectionString(dbConf)
	db := connectDB(connectionString)
	return db
}

var getConnectionString = func(config *utils.Config) string {

	return fmt.Sprintf("%s:%s@tcp(%s)/%s?charset=utf8mb4&collation=utf8mb4_unicode_ci&parseTime=true&multiStatements=true",
		config.Database.User, config.Database.Password, config.Database.Host, config.Database.Database)

}

func connectDB(connectString string) (conn *gorm.DB) {

	conn, err := gorm.Open("mysql", connectString)
	if err != nil {
		panic("Could not connect to database")
	}

	conn.SingularTable(true)
	return conn
}

func CloseDB(conn *gorm.DB) {
	conn.DB().Close()
}
