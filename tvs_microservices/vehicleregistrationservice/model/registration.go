package model

import (
	"time"

	"github.com/gin-gonic/gin"
)

type Vehicleregistraionsummary struct {
	Vehicleregid     int       `json:"id,omitempty" binding:"-"`
	Vehicledetailsid int       `json:"vehicledetailsid" binding:"required"`
	Regno            string    `json:"regno" binding:"required"`
	Chasisnumber     string    `json:"chasisnumber" binding:"required"`
	Rtoname          string    `json:"rtoname" binding:"required"`
	Regdate          time.Time `json:"registrationdate" binding:"required"`
	Expirydate       time.Time `json:"expirydate" binding:"required"`
	Insuranceid      int       `json:"insuranceid" binding:"required"`
	Pucid            int       `json:"pucid" binding:"required"`
	Createdat        time.Time `json:"createdat" binding:"-"`
	Updatedat        time.Time `json:"updatedat" binding:"-"`
}

type Vehicledetails struct {
	Vehicledetailsid int       `json:"id,omitempty" binding:"-"`
	Fueltype         string    `json:"fueltype" binding:"required"`
	Age              string    `json:"age" binding:"required"`
	Type             string    `json:"type" binding:"required"`
	Model            string    `json:"model" binding:"required"`
	Manufacturer     string    `json:"manufacturer" binding:"required"`
	Purchasedate     string    `json:"purchasedate" binding:"required"`
	Createdat        time.Time `json:"createdat" binding:"-"`
	Updatedat        time.Time `json:"updatedat" binding:"-"`
}

type Vehicleinsurancedetails struct {
	Vehicleinsuranceid int       `json:"id,omitempty" binding:"-"`
	Startdate          time.Time `json:"startdate" binding:"required"`
	Enddate            time.Time `json:"enddate" binding:"required"`
	Providername       string    `json:"providername" binding:"required"`
	Identityproof      string    `json:"identityproof" binding:"required"`
	Identityproof_no   string    `json:"identityproof_no" binding:"required"`
	Coverage           int       `json:"coverage" binding:"required"`
	Createdat          time.Time `json:"createdat" binding:"-"`
	Updatedat          time.Time `json:"updatedat" binding:"-"`
}

type Vehiclepucdetails struct {
	Vehiclepucid       int       `json:"id,omitempty" binding:"-"`
	Pucserialno        string    `json:"pucserialno" binding:"required"`
	Startdate          time.Time `json:"startdate" binding:"required"`
	Enddate            time.Time `json:"enddate" binding:"required"`
	Providername       string    `json:"providername" binding:"required"`
	Testvalidityperiod string    `json:"validtype" binding:"required"`
	Emissionreading    string    `json:"emissionreading" binding:"required"`
	Createdat          time.Time `json:"createdat" binding:"-"`
	Updatedat          time.Time `json:"updatedat" binding:"-"`
}

type VehicleRegInfo struct {
	Summary        Vehicleregistraionsummary `json:"summary"`
	Vehicledetails Vehicledetails            `json:"vehicledetails"`
	Insurance      Vehicleinsurancedetails   `json:"insurance"`
	Puc            Vehiclepucdetails         `json:"puc"`
}

type RegistrationRepository interface {
	GetVehicleSummary(vehno string) (Vehicleregistraionsummary, error)
	VerifyVehicle(chasisno, vehno string) (bool, error)
	GetVehicleRegistration(vehno string) (VehicleRegInfo, error)
	GetVehicleInsurance(vehno string) (Vehicleinsurancedetails, error)
	GetVehiclePuc(vehno string) (Vehiclepucdetails, error)
	GetVehicleDetails(vehno string) (Vehicledetails, error)
}

type RegistrationService interface {
	GetVehicleSummary(vehno string) (Vehicleregistraionsummary, error)
	VerifyVehicle(chasisno, vehno string) (bool, error)
	GetVehicleRegistration(vehno string) (VehicleRegInfo, error)
	GetVehicleInsurance(vehno string) (Vehicleinsurancedetails, error)
	GetVehiclePuc(vehno string) (Vehiclepucdetails, error)
	GetVehicleDetails(vehno string) (Vehicledetails, error)
}

type RegistrationController interface {
	VehicleSummary(c *gin.Context)
	VehicleRegistration(c *gin.Context)
	VehicleInsurance(c *gin.Context)
	VehiclePuc(c *gin.Context)
	VehicleInfo(c *gin.Context)
}
