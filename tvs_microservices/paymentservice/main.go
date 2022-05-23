package main

import (
	"paymentMicroservice/config"
	"paymentMicroservice/routes"

	"github.com/KadirSheikh/tvs_utils/middleware"

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
	routes.HandlePaymentRequests(r, db)
	PORT := conf.Server.Port
	r.Run(PORT)
}

func main() {
	r := gin.Default()
	r.Use(middleware.CORS)
	initialize(r)
}
