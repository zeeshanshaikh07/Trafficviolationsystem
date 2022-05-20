package controller

import (
	"net/http"
	"strconv"

	"violationdetails/model"

	"github.com/KadirSheikh/tvs_utils/utils"

	"github.com/gin-gonic/gin"
)

type ViolationController interface {
	GetAllViolations(context *gin.Context)
	GetViolations(context *gin.Context)
	CloseViolation(context *gin.Context)
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

func (c *violationController) GetAllViolations(context *gin.Context) {
	vno := context.Param("vehicleregno")
	if vno == "" {
		data := utils.NotFound(0)
		response := utils.BuildResponse(data.Message, data.Code, utils.EmptyObj{})
		context.JSON(http.StatusNotFound, response)
	}

	authHeader := context.GetHeader("Authorization")

	_, errToken := c.jwtService.ValidateToken(authHeader)
	if errToken != nil {
		res := utils.BadRequest()
		response := utils.BuildResponse(res.Message, res.Code, utils.EmptyObj{})
		context.JSON(http.StatusBadRequest, response)
	}
	isclose := context.Query("isclose")

	violationlist, err := c.violationService.GetAllViolations(vno, isclose)
	if err != nil {
		data := utils.ViolationFound(0)
		response := utils.BuildResponse(data.Message, data.Code, utils.EmptyObj{})
		context.JSON(http.StatusNotFound, response)
	} else {
		data := utils.OK(1)
		res := utils.BuildResponse(data.Message, data.Code, violationlist)
		context.JSON(http.StatusOK, res)
	}
}

func (c *violationController) GetViolations(context *gin.Context) {

	filter := context.Query("filter")
	value := context.Query("value")

	violationlist, err := c.violationService.GetViolations(filter, value)
	if err != nil {
		data := utils.ViolationFound(0)
		response := utils.BuildResponse(data.Message, data.Code, utils.EmptyObj{})
		context.JSON(http.StatusNotFound, response)
	} else {
		data := utils.OK(1)
		res := utils.BuildResponse(data.Message, data.Code, violationlist)
		context.JSON(http.StatusOK, res)
	}
}

func (c *violationController) CloseViolation(context *gin.Context) {
	var violationclosedto model.ViolationCloseDto
	errDTO := context.ShouldBind(&violationclosedto)
	if errDTO != nil {
		res := utils.BadRequest()
		response := utils.BuildResponse(res.Message, res.Code, utils.EmptyObj{})
		context.JSON(http.StatusBadRequest, response)
		return
	}
	id, err := strconv.ParseUint(context.Param("tvsid"), 0, 0)
	if err != nil {
		data := utils.NotFound(0)
		response := utils.BuildResponse(data.Message, data.Code, utils.EmptyObj{})
		context.JSON(http.StatusNotFound, response)
		return
	}
	violationclose, err := c.violationService.CloseViolation(violationclosedto, id)
	if err != nil {
		res := utils.ViolationFound(1)
		response := utils.BuildResponse(res.Message, res.Code, utils.EmptyObj{})
		context.JSON(http.StatusNotFound, response)
	} else {
		res := utils.Updated()
		response := utils.BuildResponse(res.Message, res.Code, violationclose)
		context.JSON(http.StatusOK, response)

	}

}
