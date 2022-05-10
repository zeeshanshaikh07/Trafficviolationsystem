package utils

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"trafficsystem.com/vehicleregistrationservice/middleware"
	"trafficsystem.com/vehicleregistrationservice/model"
	"trafficsystem.com/vehicleregistrationservice/service"
)

func Authoizerequest(c *gin.Context, srv model.RegistrationService) bool {

	payload := c.MustGet(middleware.AuthorizationPayloadKey).(*service.Payload)

	fmt.Println("In VehicleRegistration ", payload)

	status, err := srv.VerifyVehicle(payload.ChasisNumber, payload.Vehicleregno)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"Error": err})
		fmt.Println("Failed to verify vehicle ", err, status)
		return status
	}

	fmt.Println("verify vehicle ", err, status)
	if !status {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"Error": "Invalid vehicle",
		})
		fmt.Println("Failed to verify vehicle invalid status ", err, status)
		return status
	}

	fmt.Println("Successfully verified vehicle", err, status)

	return status
}
