package routes

import (
	"fmt"

	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
	_ "gorm.io/gorm"
	"trafficsystem.com/vehicleregistrationservice/repository"
	"trafficsystem.com/vehicleregistrationservice/rest"
	"trafficsystem.com/vehicleregistrationservice/service"
)

func HandleRegistrationRequests(r *gin.Engine, db *gorm.DB) {

	regCtrl := rest.NewRegistrationController(service.NewRegistrationService(repository.NewRegistrationRepo(db)))

	fmt.Println("Inside handle request")

	basicurl := r.Group("/api/v1/vehicle")
	basicurl.GET("/registration", regCtrl.VehicleRegistration)
	basicurl.GET("/insurance", regCtrl.VehicleInsurance)
	basicurl.GET("/puc", regCtrl.VehiclePuc)
	basicurl.GET("/:vno", regCtrl.VehicleInfo)
}
