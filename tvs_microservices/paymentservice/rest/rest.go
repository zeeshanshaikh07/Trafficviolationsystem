package rest

import (
	"net/http"

	"paymentMicroservice/model"

	"github.com/KadirSheikh/tvs_utils/utils"
	"github.com/gin-gonic/gin"
)

type paymentController struct {
	paymentService model.PaymentService
}

func NewPaymentController(paymentService model.PaymentService) *paymentController {
	return &paymentController{
		paymentService: paymentService,
	}
}
func (c *paymentController) MakePayment(ctx *gin.Context) {
	var paymentDTO model.Paymentdto
	errDTO := ctx.ShouldBind(&paymentDTO)
	if errDTO != nil {
		data := utils.BadRequest()
		data.Message = errDTO.Error()
		response := utils.BuildResponse(data.Message, data.Code, utils.EmptyObj{})
		ctx.AbortWithStatusJSON(http.StatusBadRequest, response)
		return
	} else {
		paymentcreated, err := c.paymentService.MakePayment(paymentDTO)
		if err != nil {
			data := utils.NotFound(8)
			data.Message = err.Error()
			response := utils.BuildResponse(data.Message, data.Code, utils.EmptyObj{})
			ctx.JSON(http.StatusBadRequest, response)
		} else {
			data := utils.Created(3)
			response := utils.BuildResponse(data.Message, data.Code, paymentcreated)
			ctx.JSON(http.StatusCreated, response)
		}

	}
}

func (c *paymentController) GetAllPayments(context *gin.Context) {
	loginid := context.Param("loginid")
	if loginid == "" {
		data := utils.BadRequest()
		response := utils.BuildResponse(data.Message, data.Code, utils.EmptyObj{})
		context.AbortWithStatusJSON(http.StatusBadRequest, response)
		return
	}

	userpayment, err := c.paymentService.GetAllPaymentDetails(loginid)
	if err != nil {
		data := utils.NotFound(8)
		response := utils.BuildResponse(data.Message, data.Code, utils.EmptyObj{})
		context.JSON(http.StatusBadRequest, response)
	} else {
		data := utils.OK(4)
		response := utils.BuildResponse(data.Message, data.Code, userpayment)
		context.JSON(http.StatusOK, response)
	}

}
