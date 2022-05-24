package rest

import (
	"net/http"
	"strconv"

	"github.com/KadirSheikh/tvs_utils/middleware"
	"github.com/KadirSheikh/tvs_utils/utils"
	"github.com/gin-gonic/gin"
	"trafficsystem.com/vehicleregistrationservice/model"
)

type sRegistrationcontroller struct {
	srv model.RegistrationService
}

func NewRegistrationController(s model.RegistrationService) *sRegistrationcontroller {
	return &sRegistrationcontroller{srv: s}
}

func AuthorizeRequest(c *gin.Context, srv model.RegistrationService) bool {

	payload := c.MustGet(middleware.AuthorizationPayloadKey).(*utils.Payload)

	status, err := srv.VerifyVehicle(payload.ChasisNumber, payload.Vehicleregno)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"Error": err})
		return status
	}

	if !status {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"Error": "Invalid vehicle",
		})
		return status
	}

	return status
}

func (ctrl sRegistrationcontroller) VehicleSummary(c *gin.Context) {
	vno := c.Param("vno")
	obj, err := ctrl.srv.GetVehicleSummary(vno)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"Server error": err})
	}

	c.JSON(http.StatusOK, gin.H{"Summary": obj})
}

func (ctrl sRegistrationcontroller) VehicleRegistration(c *gin.Context) {
	var isConsolidated int
	isConsolidated, _ = strconv.Atoi(c.DefaultQuery("isconsolidated", "0"))
	vno := c.Query("vehicleregno")

	if !AuthorizeRequest(c, ctrl.srv) {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
			"Error": "Authorization failed!",
		})
		return
	}

	if isConsolidated == 1 {
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

	if !AuthorizeRequest(c, ctrl.srv) {
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
	if !AuthorizeRequest(c, ctrl.srv) {
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
	if !AuthorizeRequest(c, ctrl.srv) {
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
