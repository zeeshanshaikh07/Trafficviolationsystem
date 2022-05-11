package controller

import (
	"net/http"

	"violationdetails/model"
	"violationdetails/service"
	"violationdetails/utils"

	"github.com/gin-gonic/gin"
)

type ViolationController interface {
	All(context *gin.Context)
}

type violationController struct {
	violationService service.ViolationService
	jwtService       service.JWTService
}

func NewViolationController(violationServ service.ViolationService, jwtServ service.JWTService) ViolationController {
	return &violationController{
		violationService: violationServ,
		jwtService:       jwtServ,
	}
}

func (c *violationController) All(context *gin.Context) {
	vno := context.Param("vehicleregno")
	var trafficviolationsystem []model.Trafficviolationsystem = c.violationService.All(vno)
	res := utils.BuildResponse("OK", 201, trafficviolationsystem)
	context.JSON(http.StatusOK, res)
}
