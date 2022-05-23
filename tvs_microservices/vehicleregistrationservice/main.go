package main

import (
	"fmt"

	db "trafficsystem.com/vehicleregistrationservice/config"
	"trafficsystem.com/vehicleregistrationservice/middleware"
	"trafficsystem.com/vehicleregistrationservice/routes"
	"trafficsystem.com/vehicleregistrationservice/service"
	"trafficsystem.com/vehicleregistrationservice/utils"

	"github.com/gin-gonic/gin"
)

func initializeComponents(r *gin.Engine, conf *utils.Config) {
	//Get db object
	gormCon := db.InitializeDbConnection(conf)

	r.Use(middleware.AuthMiddleware(service.NewJWTService(conf.AuthInfo.Secrekey)))

	routes.HandleRegistrationRequests(r, gormCon)
}

func initializeConfigsAndRoutes(r *gin.Engine) {
	conf := utils.NewConfig() //Initialize config

	initializeComponents(r, conf)

	fmt.Println("Vehicle registration service is running on port ", conf.Srv.Port)

	port := fmt.Sprintf(":%s", conf.Srv.Port)
	fmt.Println("server port ", port)
	r.Run(port)
}

func main() {
	r := gin.Default()
	r.Use(middleware.CORS)
	initializeConfigsAndRoutes(r)
}
