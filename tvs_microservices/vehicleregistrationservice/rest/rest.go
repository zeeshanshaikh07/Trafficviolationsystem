package rest

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"trafficsystem.com/vehicleregistrationservice/model"
)

type sRegistrationcontroller struct {
	srv model.RegistrationService
}

func NewRegistrationController(s model.RegistrationService) *sRegistrationcontroller {
	return &sRegistrationcontroller{srv: s}
}

func (ctrl sRegistrationcontroller) VehicleSummary(c *gin.Context) {
	fmt.Println("inside veh summary")
	obj, _ := ctrl.srv.GetVehicleSummary("123")
	fmt.Println("Object ", obj)
	c.JSON(http.StatusOK, gin.H{"Summary": obj})
}
