package rest

import (
	"net/http"
	"strconv"

	"trafficviolationsystem/userservice/model"
	"trafficviolationsystem/userservice/service"
	"trafficviolationsystem/userservice/utils"

	"github.com/gin-gonic/gin"
)

//userController interface is a contract what this controller can do
type UserController interface {
	Login(ctx *gin.Context)
	Register(ctx *gin.Context)
}

type userController struct {
	userService service.UserService
	jwtService  service.JWTService
}

func NewUserController(userService service.UserService, jwtService service.JWTService) UserController {
	return &userController{
		userService: userService,
		jwtService:  jwtService,
	}
}

func (c *userController) Login(ctx *gin.Context) {
	var loginDTO model.LoginDTO
	errDTO := ctx.ShouldBind(&loginDTO)
	if errDTO != nil {
		response := utils.BuildErrorResponse("Failed to process request", errDTO.Error(), utils.EmptyObj{})
		ctx.AbortWithStatusJSON(http.StatusBadRequest, response)
		return
	}
	userResult := c.userService.VerifyCredential(loginDTO.Email, loginDTO.Password)
	if v, ok := userResult.(model.User); ok {
		generatedToken := c.jwtService.GenerateToken(strconv.FormatUint(v.ID, 10))
		v.Token = generatedToken
		response := utils.BuildSuccessResponse(true, "Login Successful!", v)
		ctx.JSON(http.StatusOK, response)
		return
	}
	response := utils.BuildErrorResponse("Please check again your credential", "Invalid Credential", utils.EmptyObj{})
	ctx.AbortWithStatusJSON(http.StatusBadRequest, response)
}

func (c *userController) Register(ctx *gin.Context) {
	var registerDTO model.RegisterDTO
	errDTO := ctx.ShouldBind(&registerDTO)
	if errDTO != nil {
		response := utils.BuildErrorResponse("Failed to process request", errDTO.Error(), utils.EmptyObj{})
		ctx.AbortWithStatusJSON(http.StatusBadRequest, response)
		return
	}

	if !c.userService.IsDuplicateEmail(registerDTO.Email) {
		response := utils.BuildErrorResponse("This email already exists.", "Failed to process request", utils.EmptyObj{})
		ctx.JSON(http.StatusConflict, response)
	} else {
		createdUseror := c.userService.CreateUser(registerDTO)
		token := c.jwtService.GenerateToken(strconv.FormatUint(createdUseror.ID, 10))
		createdUseror.Token = token
		response := utils.BuildSuccessResponse(true, "Registration Successful!", createdUseror)
		ctx.JSON(http.StatusCreated, response)
	}
}
