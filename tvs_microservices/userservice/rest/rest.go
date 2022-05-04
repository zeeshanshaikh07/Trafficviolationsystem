package rest

import (
	"fmt"
	"net/http"
	"strconv"

	"trafficviolationsystem/userservice/model"
	"trafficviolationsystem/userservice/service"
	"trafficviolationsystem/userservice/utils"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
)

type userController struct {
	userService model.UserService
	jwtService  service.JWTService
}

func NewUserController(userService model.UserService, jwtService service.JWTService) *userController {
	return &userController{
		userService: userService,
		jwtService:  jwtService,
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
		generatedToken := c.jwtService.GenerateToken(strconv.FormatUint(v.Userid, 10))
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
		token := c.jwtService.GenerateToken(strconv.FormatUint(createdUser.Userid, 10))
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
		userid := c.getUseridByToken(authHeader)
		convertedUserid, err := strconv.ParseUint(userid, 10, 64)
		if err == nil {
			userVehicleDTO.Userid = convertedUserid
		}
		result := c.userService.AddVehicle(userVehicleDTO)
		response := utils.BuildResponse("Vehicle added successfully!", 201, result)
		context.JSON(http.StatusCreated, response)
	}
}

func (c *userController) getUseridByToken(token string) string {
	aToken, err := c.jwtService.ValidateToken(token)
	if err != nil {
		panic(err.Error())
	}
	claims := aToken.Claims.(jwt.MapClaims)
	id := fmt.Sprintf("%v", claims["userid"])
	return id
}
