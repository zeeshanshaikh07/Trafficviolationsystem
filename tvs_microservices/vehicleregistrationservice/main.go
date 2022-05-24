package main

import (
	"fmt"

	"github.com/KadirSheikh/tvs_utils/middleware"
	"github.com/KadirSheikh/tvs_utils/utils"
	db "trafficsystem.com/vehicleregistrationservice/config"
	"trafficsystem.com/vehicleregistrationservice/routes"

	"github.com/gin-gonic/gin"
)

func initializeComponents(r *gin.Engine, conf *utils.Config) {
	gormCon := db.InitializeDbConnection(conf)
	r.Use(middleware.AuthMiddleware(utils.NewJWTService()))
	routes.HandleRegistrationRequests(r, gormCon)
}

func initializeConfigsAndRoutes(r *gin.Engine) {
	conf := utils.NewConfig()
	initializeComponents(r, conf)
	port := fmt.Sprintf(":%s", conf.Server.Port)
	r.Run(port)
}

func main() {
	r := gin.Default()
	r.Use(middleware.CORS)
	initializeConfigsAndRoutes(r)
}
