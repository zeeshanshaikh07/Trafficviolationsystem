package routes

import (
	"violationdetails/model"
	"violationdetails/repository"
	controller "violationdetails/rest"
	"violationdetails/service"

	"github.com/KadirSheikh/tvs_utils/middleware"

	"github.com/KadirSheikh/tvs_utils/utils"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func HandleViolationRequests(r *gin.Engine, db *gorm.DB) {
	var (
		jwtService utils.JWT = utils.NewJWTService()

		violationRepository model.ViolationRepository      = repository.NewViolationRepository(db)
		violationService    model.ViolationService         = service.NewViolationService(violationRepository)
		violationController controller.ViolationController = controller.NewViolationController(violationService, jwtService)
	)
	violationRoutes := r.Group("/api/v1/violation", middleware.AuthorizeJWT(jwtService))
	{
		violationRoutes.GET("/:vehicleregno", violationController.GetAllViolations)
		violationRoutes.GET("/mode", violationController.GetViolations)
		violationRoutes.PUT("/:tvsid", violationController.CloseViolation)
	}
}
