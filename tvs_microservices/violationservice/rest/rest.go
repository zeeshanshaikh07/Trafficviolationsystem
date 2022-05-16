package controller

import (
	"net/http"

	"violationdetails/model"

	"github.com/zeeshanshaikh07/tvs_utils/utils"

	"github.com/gin-gonic/gin"
)

type ViolationController interface {
	All(context *gin.Context)
}

type violationController struct {
	violationService model.ViolationService
	jwtService       utils.JWT
}

func NewViolationController(violationServ model.ViolationService, jwtServ utils.JWT) ViolationController {
	return &violationController{
		violationService: violationServ,
		jwtService:       jwtServ,
	}
}

func (c *violationController) All(context *gin.Context) {
	vno := context.Param("vehicleregno")
	if vno == "" {
		data := utils.NotFound()
		response := utils.BuildResponse(data.Message, data.Code, utils.EmptyObj{})
		context.JSON(http.StatusBadRequest, response)
	}
	closure := context.Query("datatype")
	authHeader := context.GetHeader("Authorization")

	_, errToken := c.jwtService.ValidateToken(authHeader)
	if errToken != nil {
		res := utils.BadRequest()
		response := utils.BuildResponse(res.Message, res.Code, utils.EmptyObj{})
		context.JSON(http.StatusBadRequest, response)
	}

	trafficviolationsystem, err := c.violationService.All(vno, closure)
	if err != nil {
		data := utils.NotFound()
		response := utils.BuildResponse(data.Message, data.Code, utils.EmptyObj{})
		context.JSON(http.StatusBadRequest, response)
	} else {
		data := utils.Ok()
		res := utils.BuildResponse(data.Message, data.Code, trafficviolationsystem)
		context.JSON(http.StatusOK, res)
	}
}
