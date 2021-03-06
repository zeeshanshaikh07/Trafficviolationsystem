package main

import (
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"violationdetails/config"
	"violationdetails/routes"

	"github.com/KadirSheikh/tvs_utils/middleware"

	"github.com/KadirSheikh/tvs_utils/utils"
)

func initialize(r *gin.Engine) {
	conf := utils.NewConfig()
	var (
		db *gorm.DB = config.SetupDBConnection(conf)
	)

	defer config.CloseDBConnection(db)
	routes.HandleViolationRequests(r, db)

	PORT := conf.Server.Port
	r.Run(PORT)
}

func main() {

	r := gin.Default()

	r.Use(middleware.CORS)
	initialize(r)
}
