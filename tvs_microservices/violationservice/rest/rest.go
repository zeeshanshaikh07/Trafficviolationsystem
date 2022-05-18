package controller

import (
	"net/http"
	"strconv"

	"violationdetails/model"

	"github.com/zeeshanshaikh07/tvs_utils/utils"

	"github.com/gin-gonic/gin"
)

type ViolationController interface {
	GetAllVoilations(context *gin.Context)
	Close(context *gin.Context)
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

func (c *violationController) GetAllVoilations(context *gin.Context) {
	vno := context.Param("vehicleregno")
	if vno == "" {
		data := utils.NotFound()
		response := utils.BuildResponse(data.Message, data.Code, utils.EmptyObj{})
		context.JSON(http.StatusBadRequest, response)
	}
	isopen := context.Query("isopen")
	authHeader := context.GetHeader("Authorization")

	_, errToken := c.jwtService.ValidateToken(authHeader)
	if errToken != nil {
		res := utils.BadRequest()
		response := utils.BuildResponse(res.Message, res.Code, utils.EmptyObj{})
		context.JSON(http.StatusBadRequest, response)
	}

	violationlist, err := c.violationService.GetAllVoilations(vno, isopen)
	if err != nil {
		data := utils.NotFound()
		response := utils.BuildResponse(data.Message, data.Code, utils.EmptyObj{})
		context.JSON(http.StatusBadRequest, response)
	} else {
		data := utils.Ok()
		res := utils.BuildResponse(data.Message, data.Code, violationlist)
		context.JSON(http.StatusOK, res)
	}
}

func (c *violationController) Close(context *gin.Context) {
	var violationclosedto model.Violationclosedto
	errDTO := context.ShouldBind(&violationclosedto)
	if errDTO != nil {
		res := utils.BadRequest()
		response := utils.BuildResponse(res.Message, res.Code, utils.EmptyObj{})
		context.JSON(http.StatusBadRequest, response)
		return
	}
	id, err := strconv.ParseUint(context.Param("tvsid"), 0, 0)
	if err != nil {
		data := utils.NotFound()
		response := utils.BuildResponse(data.Message, data.Code, utils.EmptyObj{})
		context.JSON(http.StatusBadRequest, response)
		return
	}
	violationclose, err := c.violationService.CloseViolation(violationclosedto, id)
	if err != nil {

		res := utils.NotFound()

		response := utils.BuildResponse(res.Message, res.Code, utils.EmptyObj{})

		context.JSON(http.StatusBadRequest, response)

	} else {

		// res := utils.Updated()

		response := utils.BuildResponse("success", 200, violationclose)

		context.JSON(http.StatusOK, response)

	}

}
