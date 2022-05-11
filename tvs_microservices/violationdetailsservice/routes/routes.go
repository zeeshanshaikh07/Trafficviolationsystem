package routes

import (
	"violationdetails/repository"
	controller "violationdetails/rest"
	"violationdetails/service"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func HandleViolationRequests(r *gin.Engine, db *gorm.DB) {
	var (
		jwtService service.JWTService = service.NewJWTService()

		violationRepository repository.ViolationRepository = repository.NewViolationRepository(db)
		violationService    service.ViolationService       = service.NewViolationService(violationRepository)
		violationController controller.ViolationController = controller.NewViolationController(violationService, jwtService)
	)
	violationRoutes := r.Group("/api/v1/violation")
	{
		violationRoutes.GET("/:vehicleregno", violationController.All)

	}
}
