package main

import (
	"trafficviolationsystem/userservice/config"
	"trafficviolationsystem/userservice/routes"
	"trafficviolationsystem/userservice/utils"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func initializeDbAndRoutes(r *gin.Engine) {
	var (
		db *gorm.DB = config.SetupDBConnection()
	)

	defer config.CloseDBConnection(db)
	routes.HandleAuthRequests(r, db)

	conf := utils.NewConfig()
	PORT := conf.Server.Port
	r.Run(PORT)
}

func main() {

	r := gin.Default()
	initializeDbAndRoutes(r)

}
