package rest

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"trafficsystem.com/vehicleregistrationservice/model"
	"trafficsystem.com/vehicleregistrationservice/utils"
)

type sRegistrationcontroller struct {
	srv model.RegistrationService
}

func NewRegistrationController(s model.RegistrationService) *sRegistrationcontroller {
	return &sRegistrationcontroller{srv: s}
}

func (ctrl sRegistrationcontroller) VehicleSummary(c *gin.Context) {
	vno := c.Param("vno")
	obj, err := ctrl.srv.GetVehicleSummary(vno)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"Server error": err})
	}

	fmt.Println("Object ", obj)
	c.JSON(http.StatusOK, gin.H{"Summary": obj})
}

func (ctrl sRegistrationcontroller) VehicleRegistration(c *gin.Context) {
	var isConsolidated int
	isConsolidated, _ = strconv.Atoi(c.DefaultQuery("isconsolidated", "0"))
	vno := c.Query("vehicleregno")

	if !utils.Authoizerequest(c, ctrl.srv) {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
			"Error": "Authorization failed!",
		})
		return
	}

	if isConsolidated == 1 {
		fmt.Println("inside vehicle summary", vno)
		obj, err := ctrl.srv.GetVehicleSummary(vno)

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"Server error": err})
			return
		}

		c.JSON(http.StatusOK, gin.H{"Summary": obj})
		return
	}

	obj, err := ctrl.srv.GetVehicleRegistration(vno)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"Server error": err})
		return
	}

	c.JSON(http.StatusOK, gin.H{"Registration": obj})
}

func (ctrl sRegistrationcontroller) VehicleInsurance(c *gin.Context) {

	if !utils.Authoizerequest(c, ctrl.srv) {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
			"Error": "Authorization failed!",
		})
		return
	}

	vno := c.Query("vehicleregno")
	obj, err := ctrl.srv.GetVehicleInsurance(vno)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"Server error": err})
	}
	c.JSON(http.StatusOK, gin.H{"Insurance": obj})
}

func (ctrl sRegistrationcontroller) VehiclePuc(c *gin.Context) {
	if !utils.Authoizerequest(c, ctrl.srv) {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
			"Error": "Authorization failed!",
		})
		return
	}

	vno := c.Query("vehicleregno")
	obj, err := ctrl.srv.GetVehiclePuc(vno)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"Server error": err})
	}
	c.JSON(http.StatusOK, gin.H{"Puc": obj})
}

func (ctrl sRegistrationcontroller) VehicleInfo(c *gin.Context) {
	if !utils.Authoizerequest(c, ctrl.srv) {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
			"Error": "Authorization failed!",
		})
		return
	}

	vno := c.Param("vno")
	obj, err := ctrl.srv.GetVehicleDetails(vno)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"Server error": err})
	}
	c.JSON(http.StatusOK, gin.H{"VehicleDetails": obj})
}
