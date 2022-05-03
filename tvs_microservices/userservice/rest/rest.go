package rest

import (
	"net/http"
	"strconv"

	"trafficviolationsystem/userservice/model"
	"trafficviolationsystem/userservice/service"
	"trafficviolationsystem/userservice/utils"

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
		response := utils.BuildErrorResponse("Failed to process request", errDTO.Error(), utils.EmptyObj{})
		ctx.AbortWithStatusJSON(http.StatusBadRequest, response)
		return
	}
	userResult := c.userService.VerifyCredential(loginDTO.Loginid, loginDTO.Password)
	if v, ok := userResult.(model.User); ok {
		generatedToken := c.jwtService.GenerateToken(strconv.FormatUint(v.Userid, 10))
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

	if !c.userService.IsDuplicateUsername(registerDTO.Loginid) {
		response := utils.BuildErrorResponse("This username already exists.", "Failed to process request", utils.EmptyObj{})
		ctx.JSON(http.StatusConflict, response)
	} else if !c.userService.IsDuplicateEmail(registerDTO.Emailid) {
		response := utils.BuildErrorResponse("This email already exists.", "Failed to process request", utils.EmptyObj{})
		ctx.JSON(http.StatusConflict, response)
	} else {
		createdUser := c.userService.RegisterUser(registerDTO)
		token := c.jwtService.GenerateToken(strconv.FormatUint(createdUser.Userid, 10))
		createdUser.Token = token
		response := utils.BuildSuccessResponse(true, "Registration Successful!", createdUser)
		ctx.JSON(http.StatusCreated, response)
	}
}
