package rest

import (
	"fmt"
	"net/http"
	"strconv"

	"trafficviolationsystem/userservice/model"

	"trafficviolationsystem/userservice/utils"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
)

type userController struct {
	userService model.UserService
	jwt         utils.JWT
}

func NewUserController(userService model.UserService, jwtToken utils.JWT) *userController {
	return &userController{
		userService: userService,
		jwt:         jwtToken,
	}
}

func (c *userController) Login(ctx *gin.Context) {
	var loginDTO model.LoginDTO
	errDTO := ctx.ShouldBind(&loginDTO)
	if errDTO != nil {
		response := utils.BuildResponse("Failed to process request", 400, utils.EmptyObj{})
		ctx.AbortWithStatusJSON(http.StatusBadRequest, response)
		return
	}
	userResult := c.userService.VerifyCredential(loginDTO.Loginid, loginDTO.Password)
	if v, ok := userResult.(model.User); ok {
		generatedToken := c.jwt.GenerateToken(strconv.FormatUint(v.Userid, 10))
		v.Token = generatedToken
		response := utils.BuildResponse("Login Successful!", 200, v)
		ctx.JSON(http.StatusOK, response)
		return
	}
	response := utils.BuildResponse("Please check again your credential", 400, utils.EmptyObj{})
	ctx.AbortWithStatusJSON(http.StatusBadRequest, response)
}

func (c *userController) Register(ctx *gin.Context) {
	var registerDTO model.RegisterDTO
	errDTO := ctx.ShouldBind(&registerDTO)
	if errDTO != nil {
		response := utils.BuildResponse("Failed to process request", 400, utils.EmptyObj{})
		ctx.AbortWithStatusJSON(http.StatusBadRequest, response)
		return
	}

	if !c.userService.IsDuplicateUsername(registerDTO.Loginid) {
		response := utils.BuildResponse("This username already exists.", 409, utils.EmptyObj{})
		ctx.JSON(http.StatusConflict, response)
	} else if !c.userService.IsDuplicateEmail(registerDTO.Emailid) {
		response := utils.BuildResponse("This email already exists.", 409, utils.EmptyObj{})
		ctx.JSON(http.StatusConflict, response)
	} else {
		fmt.Printf("%#v\n", registerDTO)
		createdUser := c.userService.RegisterUser(registerDTO)
		token := c.jwt.GenerateToken(strconv.FormatUint(createdUser.Userid, 10))
		createdUser.Token = token
		response := utils.BuildResponse("Registration Successful!", 201, createdUser)
		ctx.JSON(http.StatusCreated, response)
	}
}

func (c *userController) AddVehicle(context *gin.Context) {
	var userVehicleDTO model.UservehiclesDTO
	errDTO := context.ShouldBind(&userVehicleDTO)
	if errDTO != nil {
		res := utils.BuildResponse("Failed to process request", 400, utils.EmptyObj{})
		context.JSON(http.StatusBadRequest, res)
	} else if !c.userService.IsDuplicateVehicleRegNo(userVehicleDTO.Regno) {
		response := utils.BuildResponse("This vehicle already exists.", 409, utils.EmptyObj{})
		context.JSON(http.StatusConflict, response)
	} else {
		authHeader := context.GetHeader("Authorization")
		token, errToken := c.jwt.ValidateToken(authHeader)
		if errToken != nil {
			panic(errToken.Error())
		}
		claims := token.Claims.(jwt.MapClaims)
		userid, err := strconv.ParseUint(fmt.Sprintf("%v", claims["userid"]), 10, 64)
		if err != nil {
			panic(err.Error())
		}

		if err == nil {
			userVehicleDTO.Userid = userid
		}
		result := c.userService.AddVehicle(userVehicleDTO)
		response := utils.BuildResponse("Vehicle added successfully!", 201, result)
		context.JSON(http.StatusCreated, response)
	}
}

func (c *userController) All(context *gin.Context) {
	authHeader := context.GetHeader("Authorization")
	token, errToken := c.jwt.ValidateToken(authHeader)
	if errToken != nil {
		panic(errToken.Error())
	}
	claims := token.Claims.(jwt.MapClaims)
	userid, err := strconv.ParseUint(fmt.Sprintf("%v", claims["userid"]), 10, 64)
	if err != nil {
		panic(err.Error())
	}
	var uservehicles []model.Uservehicles = c.userService.GetAllUserVehicles(userid)

	res := utils.BuildResponse("OK", 200, uservehicles)
	context.JSON(http.StatusOK, res)

}

func (c *userController) UpdateVehicle(context *gin.Context) {
	var vehicleUpdateDTO model.UservehiclesupdateDTO
	vehicleId, err := strconv.ParseUint(context.Param("vehicleid"), 0, 0)
	if err != nil {
		res := utils.BuildResponse("Vehicle id not found.", 404, utils.EmptyObj{})
		context.AbortWithStatusJSON(http.StatusBadRequest, res)
		return
	}
	vehicleUpdateDTO.Uservehicleid = vehicleId
	errDTO := context.ShouldBind(&vehicleUpdateDTO)
	if errDTO != nil {
		res := utils.BuildResponse("Failed to process request.", 400, utils.EmptyObj{})
		context.AbortWithStatusJSON(http.StatusBadRequest, res)
		return
	}
	if !c.userService.IsDuplicateVehicleRegNo(vehicleUpdateDTO.Regno) {
		response := utils.BuildResponse("This vehicle already exists.", 409, utils.EmptyObj{})
		context.JSON(http.StatusConflict, response)
		return
	}

	authHeader := context.GetHeader("Authorization")
	token, errToken := c.jwt.ValidateToken(authHeader)
	if errToken != nil {
		panic(errToken.Error())
	}
	claims := token.Claims.(jwt.MapClaims)
	userid, err := strconv.ParseUint(fmt.Sprintf("%v", claims["userid"]), 10, 64)
	if err != nil {
		panic(err.Error())
	}
	vehicleUpdateDTO.Userid = userid
	vehicle := c.userService.UpdateUserVehicle(vehicleUpdateDTO)
	res := utils.BuildResponse("Vehicle update successfully!", 200, vehicle)
	context.JSON(http.StatusOK, res)
}

func (c *userController) DeleteVehicle(context *gin.Context) {
	var vehicle model.Uservehicles
	vid, err := strconv.ParseUint(context.Param("vehicleid"), 0, 0)
	if err != nil {
		response := utils.BuildResponse("No param id were found", 404, utils.EmptyObj{})
		context.JSON(http.StatusBadRequest, response)
	}
	vehicle.Uservehicleid = vid
	c.userService.DeleteUserVehicle(vehicle)
	res := utils.BuildResponse("Vehicle deleted successfully!", 200, utils.EmptyObj{})
	context.JSON(http.StatusOK, res)
}
