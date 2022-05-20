package main

import (
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"violationdetails/config"
	"violationdetails/middleware"
	"violationdetails/routes"

	"github.com/KadirSheikh/tvs_utils/utils"
)

func initialize(r *gin.Engine) {
	var (
		db *gorm.DB = config.SetupDBConnection()
	)

	defer config.CloseDBConnection(db)
	routes.HandleViolationRequests(r, db)

	conf := utils.NewConfig()
	PORT := conf.Server.Port
	r.Run(PORT)
}

func main() {

	r := gin.Default()

	r.Use(middleware.CORS)
	initialize(r)
}
