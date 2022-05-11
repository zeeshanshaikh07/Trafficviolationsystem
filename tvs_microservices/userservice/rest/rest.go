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
		res := utils.BadRequest()
		response := utils.BuildResponse(res.Message, res.Code, utils.EmptyObj{})
		ctx.AbortWithStatusJSON(http.StatusBadRequest, response)
		return
	}
	userResult := c.userService.VerifyCredential(loginDTO.Loginid, loginDTO.Password)
	if v, ok := userResult.(model.User); ok {
		res := utils.OK(0)
		generatedToken := c.jwt.GenerateToken(strconv.FormatUint(v.Userid, 10))
		v.Token = generatedToken
		response := utils.BuildResponse(res.Message, res.Code, v)
		ctx.JSON(http.StatusOK, response)
		return
	}
	res := utils.InvalidCreds()
	response := utils.BuildResponse(res.Message, res.Code, utils.EmptyObj{})
	ctx.AbortWithStatusJSON(http.StatusBadRequest, response)
}

func (c *userController) Register(ctx *gin.Context) {
	var registerDTO model.RegisterDTO
	errDTO := ctx.ShouldBind(&registerDTO)
	if errDTO != nil {
		res := utils.BadRequest()
		response := utils.BuildResponse(res.Message, res.Code, utils.EmptyObj{})
		ctx.AbortWithStatusJSON(http.StatusBadRequest, response)
		return
	}

	if !c.userService.IsDuplicateUsername(registerDTO.Loginid) {
		res := utils.Conflict(0)
		response := utils.BuildResponse(res.Message, res.Code, utils.EmptyObj{})
		ctx.JSON(http.StatusConflict, response)
	} else if !c.userService.IsDuplicateEmail(registerDTO.Emailid) {
		res := utils.Conflict(1)
		response := utils.BuildResponse(res.Message, res.Code, utils.EmptyObj{})
		ctx.JSON(http.StatusConflict, response)
	} else {

		createdUser, err := c.userService.RegisterUser(registerDTO)
		if err != nil {
			res := utils.Failed()
			response := utils.BuildResponse(res.Message, res.Code, utils.EmptyObj{})
			ctx.JSON(http.StatusBadRequest, response)
		} else {
			res := utils.Created(0)
			token := c.jwt.GenerateToken(strconv.FormatUint(createdUser.Userid, 10))
			createdUser.Token = token
			response := utils.BuildResponse(res.Message, res.Code, createdUser)
			ctx.JSON(http.StatusCreated, response)
		}

	}
}

func (c *userController) AddVehicle(context *gin.Context) {
	var userVehicleDTO model.UservehiclesDTO
	errDTO := context.ShouldBind(&userVehicleDTO)
	if errDTO != nil {
		res := utils.BadRequest()
		response := utils.BuildResponse(res.Message, res.Code, utils.EmptyObj{})
		context.JSON(http.StatusBadRequest, response)
	} else if !c.userService.IsDuplicateVehicleRegNo(userVehicleDTO.Regno) {
		res := utils.Conflict(2)
		response := utils.BuildResponse(res.Message, res.Code, utils.EmptyObj{})
		context.JSON(http.StatusConflict, response)
	} else {
		authHeader := context.GetHeader("Authorization")
		token, errToken := c.jwt.ValidateToken(authHeader)
		if errToken != nil {
			res := utils.BadRequest()
			response := utils.BuildResponse(res.Message, res.Code, utils.EmptyObj{})
			context.JSON(http.StatusBadRequest, response)
		}
		claims := token.Claims.(jwt.MapClaims)
		userid, err := strconv.ParseUint(fmt.Sprintf("%v", claims["userid"]), 10, 64)
		if err != nil {
			res := utils.BadRequest()
			response := utils.BuildResponse(res.Message, res.Code, utils.EmptyObj{})
			context.JSON(http.StatusBadRequest, response)
		}
		if err == nil {
			userVehicleDTO.Userid = userid
		}
		result, err := c.userService.AddVehicle(userVehicleDTO)
		if err != nil {
			res := utils.Failed()
			response := utils.BuildResponse(res.Message, res.Code, utils.EmptyObj{})
			context.JSON(http.StatusBadRequest, response)
		} else {
			res := utils.Created(1)
			response := utils.BuildResponse(res.Message, res.Code, result)
			context.JSON(http.StatusCreated, response)
		}

	}
}

func (c *userController) All(context *gin.Context) {
	authHeader := context.GetHeader("Authorization")
	token, errToken := c.jwt.ValidateToken(authHeader)
	if errToken != nil {
		res := utils.BadRequest()
		response := utils.BuildResponse(res.Message, res.Code, utils.EmptyObj{})
		context.JSON(http.StatusBadRequest, response)
	}
	claims := token.Claims.(jwt.MapClaims)
	userid, err := strconv.ParseUint(fmt.Sprintf("%v", claims["userid"]), 10, 64)
	if err != nil {
		res := utils.BadRequest()
		response := utils.BuildResponse(res.Message, res.Code, utils.EmptyObj{})
		context.JSON(http.StatusBadRequest, response)
	}
	uservehicles, err := c.userService.GetAllUserVehicles(userid)
	if err != nil {
		res := utils.Failed()
		response := utils.BuildResponse(res.Message, res.Code, utils.EmptyObj{})
		context.JSON(http.StatusBadRequest, response)
	} else {
		res := utils.OK(1)
		response := utils.BuildResponse(res.Message, res.Code, uservehicles)
		context.JSON(http.StatusOK, response)
	}

}

func (c *userController) UpdateVehicle(context *gin.Context) {
	var vehicleUpdateDTO model.UservehiclesupdateDTO
	vehicleId, err := strconv.ParseUint(context.Param("vehicleid"), 0, 0)
	if err != nil {
		res := utils.NotFound()
		response := utils.BuildResponse(res.Message, res.Code, utils.EmptyObj{})
		context.AbortWithStatusJSON(http.StatusBadRequest, response)
		return
	}
	vehicleUpdateDTO.Uservehicleid = vehicleId
	errDTO := context.ShouldBind(&vehicleUpdateDTO)
	if errDTO != nil {
		res := utils.BadRequest()
		response := utils.BuildResponse(res.Message, res.Code, utils.EmptyObj{})
		context.JSON(http.StatusBadRequest, response)
		return
	}
	if !c.userService.IsDuplicateVehicleRegNo(vehicleUpdateDTO.Regno) {
		res := utils.Conflict(2)
		response := utils.BuildResponse(res.Message, res.Code, utils.EmptyObj{})
		context.JSON(http.StatusConflict, response)
		return
	}

	authHeader := context.GetHeader("Authorization")
	token, errToken := c.jwt.ValidateToken(authHeader)
	if errToken != nil {
		res := utils.BadRequest()
		response := utils.BuildResponse(res.Message, res.Code, utils.EmptyObj{})
		context.JSON(http.StatusBadRequest, response)
	}
	claims := token.Claims.(jwt.MapClaims)
	userid, err := strconv.ParseUint(fmt.Sprintf("%v", claims["userid"]), 10, 64)
	if err != nil {
		res := utils.BadRequest()
		response := utils.BuildResponse(res.Message, res.Code, utils.EmptyObj{})
		context.JSON(http.StatusBadRequest, response)
	}
	vehicleUpdateDTO.Userid = userid

	result, err := c.userService.IsAllowedToUpdateDelete(vehicleUpdateDTO.Userid, vehicleUpdateDTO.Uservehicleid)

	if err != nil {
		res := utils.BadRequest()
		response := utils.BuildResponse(res.Message, res.Code, utils.EmptyObj{})
		context.JSON(http.StatusBadRequest, response)
	} else {
		if result {
			vehicle, err := c.userService.UpdateUserVehicle(vehicleUpdateDTO)
			if err != nil {
				res := utils.Failed()
				response := utils.BuildResponse(res.Message, res.Code, utils.EmptyObj{})
				context.JSON(http.StatusBadRequest, response)
			} else {
				res := utils.Updated()
				response := utils.BuildResponse(res.Message, res.Code, vehicle)
				context.JSON(http.StatusOK, response)
			}
		} else {
			res := utils.Unauthorized()
			response := utils.BuildResponse(res.Message, res.Code, utils.EmptyObj{})
			context.JSON(http.StatusForbidden, response)
		}

	}

}

func (c *userController) DeleteVehicle(context *gin.Context) {
	var vehicle model.Uservehicles
	vid, err := strconv.ParseUint(context.Param("vehicleid"), 0, 0)
	if err != nil {
		res := utils.NotFound()
		response := utils.BuildResponse(res.Message, res.Code, utils.EmptyObj{})
		context.JSON(http.StatusBadRequest, response)
	}
	vehicle.Uservehicleid = vid
	authHeader := context.GetHeader("Authorization")
	token, errToken := c.jwt.ValidateToken(authHeader)
	if errToken != nil {
		res := utils.BadRequest()
		response := utils.BuildResponse(res.Message, res.Code, utils.EmptyObj{})
		context.JSON(http.StatusBadRequest, response)
	}
	claims := token.Claims.(jwt.MapClaims)
	userid, err := strconv.ParseUint(fmt.Sprintf("%v", claims["userid"]), 10, 64)
	if err != nil {
		res := utils.BadRequest()
		response := utils.BuildResponse(res.Message, res.Code, utils.EmptyObj{})
		context.JSON(http.StatusBadRequest, response)
	}

	result, err := c.userService.IsAllowedToUpdateDelete(userid, vehicle.Uservehicleid)

	if err != nil {
		res := utils.BadRequest()
		response := utils.BuildResponse(res.Message, res.Code, utils.EmptyObj{})
		context.JSON(http.StatusBadRequest, response)
	} else {
		if result {
			if c.userService.DeleteUserVehicle(vehicle) != nil {
				res := utils.Failed()
				response := utils.BuildResponse(res.Message, res.Code, utils.EmptyObj{})
				context.JSON(http.StatusBadRequest, response)
			} else {
				res := utils.Deleted()
				response := utils.BuildResponse(res.Message, res.Code, utils.EmptyObj{})
				context.JSON(http.StatusOK, response)
			}
		} else {
			res := utils.Unauthorized()
			response := utils.BuildResponse(res.Message, res.Code, utils.EmptyObj{})
			context.JSON(http.StatusForbidden, response)
		}

	}

}
