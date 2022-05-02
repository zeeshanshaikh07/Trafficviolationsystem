package main

import (
	"fmt"

	"trafficsystem.com/vehicleregistrationservice/db"
	"trafficsystem.com/vehicleregistrationservice/helper"
	"trafficsystem.com/vehicleregistrationservice/routes"

	"github.com/gin-gonic/gin"
)

func initializeComponents(r *gin.Engine, conf *helper.Config) {
	//Get db object
	gormCon := db.InitializeDbConnection(conf)

	routes.HandleRegistrationRequests(r, gormCon)
}

func initializeConfigsAndRoutes(r *gin.Engine) {
	conf := helper.NewConfig() //Initialize config

	initializeComponents(r, conf)

	fmt.Println("Vehicle registration service is running on port ", conf.Srv.Port)

	port := fmt.Sprintf(":%s", conf.Srv.Port)
	fmt.Println("server port ", port)
	r.Run(port)
}

func main() {
	r := gin.Default()

	initializeConfigsAndRoutes(r)
}
