package routes

import (
	"trafficviolationsystem/userservice/middleware"
	"trafficviolationsystem/userservice/repository"
	"trafficviolationsystem/userservice/rest"
	"trafficviolationsystem/userservice/service"

	"github.com/KadirSheikh/tvs_utils/utils"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func HandleRequests(r *gin.Engine, db *gorm.DB) {

	var (
		jwt utils.JWT = utils.NewJWTService()
	)

	userRepository := repository.NewUserRepository(db)
	userService := service.NewUserService(userRepository)
	userController := rest.NewUserController(userService, jwt)

	routes := r.Group("api/v1/users")
	{
		routes.POST("/", userController.Register)
		routes.POST("/login", userController.Login)
		routes.POST("/vehicles", middleware.AuthorizeJWT(jwt), userController.AddVehicle)
		routes.GET("/vehicles", middleware.AuthorizeJWT(jwt), userController.AllVehicles)
		routes.PUT("/vehicles/:vehicleregno", middleware.AuthorizeJWT(jwt), userController.UpdateVehicle)
		routes.DELETE("/vehicles/:vehicleregno", middleware.AuthorizeJWT(jwt), userController.DeleteVehicle)

		routes.GET("/", middleware.AuthorizeJWT(jwt), userController.UserDetails)
		routes.POST("/address", middleware.AuthorizeJWT(jwt), userController.AddAddress)
		routes.GET("/address", middleware.AuthorizeJWT(jwt), userController.GetAddress)
		routes.PUT("/reset", userController.ResetPassword)
		routes.PUT("/", middleware.AuthorizeJWT(jwt), userController.UpdateUserDetails)
		routes.PUT("/address/:addressid", userController.UpdateUserAddress)

		routes.GET("/:roleid", middleware.AuthorizeJWT(jwt), userController.GetAllUsers)

	}
}
