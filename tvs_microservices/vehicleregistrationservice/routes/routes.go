package routes

import (
	"fmt"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"trafficsystem.com/vehicleregistrationservice/repository"
	"trafficsystem.com/vehicleregistrationservice/rest"
	"trafficsystem.com/vehicleregistrationservice/service"
)

func HandleRegistrationRequests(r *gin.Engine, db *gorm.DB) {

	regCtrl := rest.NewRegistrationController(service.NewRegistrationService(repository.NewRegistrationRepo(db)))

	fmt.Println("Inside handle request")

	r.GET("/summary", regCtrl.VehicleSummary)
}
