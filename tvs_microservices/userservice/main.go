package main

import (
	"trafficviolationsystem/userservice/config"
	"trafficviolationsystem/userservice/middleware"
	"trafficviolationsystem/userservice/routes"

	"github.com/KadirSheikh/tvs_utils/utils"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func initialize(r *gin.Engine) {
	conf := utils.NewConfig()
	var (
		db *gorm.DB = config.SetupDBConnection(conf)
	)

	defer config.CloseDBConnection(db)
	routes.HandleRequests(r, db)

	PORT := conf.Server.Port
	r.Run(PORT)
}

func main() {

	r := gin.Default()
	r.Use(middleware.CORS)
	initialize(r)

}
