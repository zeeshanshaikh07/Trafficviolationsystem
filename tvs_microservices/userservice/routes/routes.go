package routes

import (
	"trafficviolationsystem/userservice/repository"
	"trafficviolationsystem/userservice/rest"
	"trafficviolationsystem/userservice/service"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func HandleAuthRequests(r *gin.Engine, db *gorm.DB) {

	var (
		jwtService service.JWTService = service.NewJWTService()
	)

	userRepository := repository.NewUserRepository(db)
	userService := service.NewUserService(userRepository)
	userController := rest.NewUserController(userService, jwtService)

	r.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"data": "Root route...!",
		})
	})

	authRoutes := r.Group("api/v1/users")
	{
		authRoutes.POST("/login", userController.Login)
		authRoutes.POST("/register", userController.Register)
	}

}
