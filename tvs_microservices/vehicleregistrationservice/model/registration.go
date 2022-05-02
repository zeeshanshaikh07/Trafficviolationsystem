package model

import (
	"github.com/gin-gonic/gin"
)

type VehicleRegistration struct {
	ID            int    `json:"id,omitempty" binding:"-"`
	VehicleNumber string `json:"vehicleno" binding:"required"`
	RTOName       string `json:"rtoname" binding:"required"`
}

type RegistrationRepository interface {
	GetVehicleSummary(vehno string) (VehicleRegistration, error)
}

type RegistrationService interface {
	GetVehicleSummary(vehno string) (VehicleRegistration, error)
}

type RegistrationController interface {
	VehicleSummary(c *gin.Context)
}
