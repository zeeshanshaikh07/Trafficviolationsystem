package rest

import (
	"fmt"
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

	if len(vno) == 0 {
		utils.BuildRes(utils.ErrInvalidRequestParam, "vehicle summary", nil, fmt.Errorf("param %s", vno), c)
		c.Abort()
	}

	if !AuthorizeRequest(c, ctrl.srv) {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
			"Error": "Authorization failed!",
		})
		return
	}

	obj, err := ctrl.srv.GetVehicleSummary(vno)
	utils.BuildRes(err, "vehicle summary", obj, err, c)
}

func (ctrl sRegistrationcontroller) VehicleRegistration(c *gin.Context) {
	var isConsolidated int
	isConsolidated, err := strconv.Atoi(c.DefaultQuery("isconsolidated", "0"))

	if err != nil {
		utils.BuildRes(err, "Registration", nil, err, c)
		return
	}

	vno := c.Query("vehicleregno")

	if len(vno) == 0 {
		utils.BuildRes(utils.ErrInvalidRequestParam, "Registration", nil, fmt.Errorf("param %s", vno), c)
		return
	}

	if !AuthorizeRequest(c, ctrl.srv) {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
			"Error": "Authorization failed!",
		})
		return
	}

	if isConsolidated == 1 {
		obj, err := ctrl.srv.GetVehicleSummary(vno)
		utils.BuildRes(err, "Registration", obj, err, c)
		return
	}

	obj, err := ctrl.srv.GetVehicleRegistration(vno)
	utils.BuildRes(err, "Registration", obj, err, c)
}

func (ctrl sRegistrationcontroller) VehicleInsurance(c *gin.Context) {
	vno := c.Query("vehicleregno")
	if len(vno) == 0 {
		utils.BuildRes(utils.ErrInvalidRequestParam, "vehicle summary", nil, fmt.Errorf("param %s", vno), c)
		return
	}

	if !AuthorizeRequest(c, ctrl.srv) {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
			"Error": "Authorization failed!",
		})
		return
	}

	obj, err := ctrl.srv.GetVehicleInsurance(vno)
	utils.BuildRes(err, "Insurance", obj, err, c)
}

func (ctrl sRegistrationcontroller) VehiclePuc(c *gin.Context) {
	vno := c.Query("vehicleregno")
	if len(vno) == 0 {
		utils.BuildRes(utils.ErrInvalidRequestParam, "vehicle summary", nil, fmt.Errorf("param %s", vno), c)
		return
	}

	if !AuthorizeRequest(c, ctrl.srv) {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
			"Error": "Authorization failed!",
		})
		return
	}

	obj, err := ctrl.srv.GetVehiclePuc(vno)
	utils.BuildRes(err, "PUC", obj, err, c)
}

func (ctrl sRegistrationcontroller) VehicleInfo(c *gin.Context) {

	vno := c.Param("vehicleregno")
	if len(vno) == 0 {
		utils.BuildRes(utils.ErrInvalidRequestParam, "vehicle summary", nil, fmt.Errorf("param %s", vno), c)
		return
	}

	if !AuthorizeRequest(c, ctrl.srv) {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
			"Error": "Authorization failed!",
		})
		return
	}

	obj, err := ctrl.srv.GetVehicleDetails(vno)
	utils.BuildRes(err, "VehicleDetails", obj, err, c)
}
