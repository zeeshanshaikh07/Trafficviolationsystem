package main

import (
	"trafficviolationsystem/userservice/config"
	"trafficviolationsystem/userservice/repository"
	"trafficviolationsystem/userservice/rest"
	"trafficviolationsystem/userservice/service"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

var (
	db         *gorm.DB           = config.SetupDBConnection()
	jwtService service.JWTService = service.NewJWTService()

	userRepository repository.UserRepository = repository.NewUserRepository(db)
	userService    service.UserService       = service.NewUserService(userRepository)
	userController rest.UserController       = rest.NewUserController(userService, jwtService)
)

func main() {
	defer config.CloseDBConnection(db)

	r := gin.Default()

	//root route
	r.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"data": "Root route...!",
		})
	})

	authRoutes := r.Group("api/auth")
	{
		authRoutes.POST("/login", userController.Login)
		authRoutes.POST("/register", userController.Register)
	}

	conf := config.NewConfig()
	PORT := conf.Database.Port //running on port 8000
	r.Run(PORT)

}
