package routes

import (
	"paymentMicroservice/repository"
	"paymentMicroservice/rest"
	"paymentMicroservice/service"

	"github.com/KadirSheikh/tvs_utils/middleware"

	"github.com/KadirSheikh/tvs_utils/utils"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func HandlePaymentRequests(r *gin.Engine, db *gorm.DB) {
	var (
		jwt utils.JWT = utils.NewJWTService()
	)
	paymentRepository := repository.NewPaymentRepository(db)
	paymentService := service.NewPaymentService(paymentRepository)
	paymentController := rest.NewPaymentController(paymentService)

	routes := r.Group("api/v1/payments", middleware.AuthorizeJWT(jwt))
	{
		routes.POST("/", paymentController.MakePayment)
		routes.GET("/:loginid", paymentController.GetAllPayments)
	}
}
