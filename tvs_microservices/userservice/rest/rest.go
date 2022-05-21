package rest

import (
	"fmt"
	"net/http"
	"strconv"

	"trafficviolationsystem/userservice/model"

	"github.com/KadirSheikh/tvs_utils/utils"

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
		generatedToken := c.jwt.GenerateToken(v.Userid, v.Loginid, v.Roleid)
		v.Token = generatedToken
		response := utils.BuildResponse(res.Message, res.Code, v)
		ctx.JSON(http.StatusOK, response)
		return
	}
	res := utils.Unauthorized(1)
	response := utils.BuildResponse(res.Message, res.Code, utils.EmptyObj{})
	ctx.AbortWithStatusJSON(http.StatusUnauthorized, response)
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
			res := utils.BadRequest()
			response := utils.BuildResponse(res.Message, res.Code, utils.EmptyObj{})
			ctx.JSON(http.StatusBadRequest, response)
		} else {
			res := utils.Created(0)
			token := c.jwt.GenerateToken(createdUser.Userid, createdUser.Loginid, createdUser.Roleid)
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
			res := utils.NotFound(0)
			response := utils.BuildResponse(res.Message, res.Code, utils.EmptyObj{})
			context.JSON(http.StatusNotFound, response)
		}
		if err == nil {
			userVehicleDTO.Userid = userid
		}

		loginid := fmt.Sprintf("%v", claims["loginid"])
		if loginid == "" {
			res := utils.NotFound(0)
			response := utils.BuildResponse(res.Message, res.Code, utils.EmptyObj{})
			context.JSON(http.StatusNotFound, response)
		}
		if err == nil {
			userVehicleDTO.Loginid = loginid
		}

		result, err := c.userService.AddVehicle(userVehicleDTO)
		if err != nil {
			res := utils.BadRequest()
			response := utils.BuildResponse(res.Message, res.Code, utils.EmptyObj{})
			context.JSON(http.StatusBadRequest, response)
		} else {
			res := utils.Created(1)
			response := utils.BuildResponse(res.Message, res.Code, result)
			context.JSON(http.StatusCreated, response)
		}

	}
}

func (c *userController) AllVehicles(context *gin.Context) {
	authHeader := context.GetHeader("Authorization")
	token, errToken := c.jwt.ValidateToken(authHeader)
	if errToken != nil {
		res := utils.BadRequest()
		response := utils.BuildResponse(res.Message, res.Code, utils.EmptyObj{})
		context.JSON(http.StatusBadRequest, response)
	}
	claims := token.Claims.(jwt.MapClaims)
	loginid := fmt.Sprintf("%v", claims["loginid"])
	if loginid == "" {
		res := utils.NotFound(0)
		response := utils.BuildResponse(res.Message, res.Code, utils.EmptyObj{})
		context.JSON(http.StatusNotFound, response)
	}

	loginidParam := context.Query("loginid")
	if loginidParam == "" {
		uservehicles, err := c.userService.GetAllUserVehicles(loginid)
		if err != nil {
			res := utils.NotFound(5)
			response := utils.BuildResponse(res.Message, res.Code, utils.EmptyObj{})
			context.JSON(http.StatusNotFound, response)
		} else {
			res := utils.OK(4)
			response := utils.BuildResponse(res.Message, res.Code, uservehicles)
			context.JSON(http.StatusOK, response)
		}
	} else {
		uservehicles, err := c.userService.GetAllUserVehicles(loginidParam)
		if err != nil {
			res := utils.NotFound(5)
			response := utils.BuildResponse(res.Message, res.Code, utils.EmptyObj{})
			context.JSON(http.StatusNotFound, response)
		} else {
			res := utils.OK(4)
			response := utils.BuildResponse(res.Message, res.Code, uservehicles)
			context.JSON(http.StatusOK, response)
		}
	}

}

func (c *userController) DeleteVehicle(context *gin.Context) {
	var vehicle model.Uservehicles
	regno := context.Param("vehicleregno")
	if regno == "" {
		res := utils.NotFound(2)
		response := utils.BuildResponse(res.Message, res.Code, utils.EmptyObj{})
		context.JSON(http.StatusBadRequest, response)
	}
	vehicle.Regno = regno
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
		res := utils.NotFound(0)
		response := utils.BuildResponse(res.Message, res.Code, utils.EmptyObj{})
		context.JSON(http.StatusBadRequest, response)
	}

	result, err := c.userService.IsAllowedToUpdateDelete(userid, vehicle.Regno)

	if err != nil {
		res := utils.BadRequest()
		response := utils.BuildResponse(res.Message, res.Code, utils.EmptyObj{})
		context.JSON(http.StatusBadRequest, response)
	} else {
		if result {
			if c.userService.DeleteUserVehicle(vehicle) != nil {
				res := utils.BadRequest()
				response := utils.BuildResponse(res.Message, res.Code, utils.EmptyObj{})
				context.JSON(http.StatusBadRequest, response)
			} else {
				res := utils.OK(2)
				response := utils.BuildResponse(res.Message, res.Code, utils.EmptyObj{})
				context.JSON(http.StatusOK, response)
			}
		} else {
			res := utils.Unauthorized(0)
			response := utils.BuildResponse(res.Message, res.Code, utils.EmptyObj{})
			context.JSON(http.StatusUnauthorized, response)
		}

	}

}

func (c *userController) UserDetails(context *gin.Context) {
	authHeader := context.GetHeader("Authorization")
	token, errToken := c.jwt.ValidateToken(authHeader)
	if errToken != nil {
		res := utils.BadRequest()
		response := utils.BuildResponse(res.Message, res.Code, utils.EmptyObj{})
		context.JSON(http.StatusBadRequest, response)
	}
	claims := token.Claims.(jwt.MapClaims)
	loginid := fmt.Sprintf("%v", claims["loginid"])
	if loginid == "" {
		res := utils.NotFound(0)
		response := utils.BuildResponse(res.Message, res.Code, utils.EmptyObj{})
		context.JSON(http.StatusNotFound, response)
	}

	loginidParam := context.Query("loginid")
	if loginidParam == "" {
		user, err := c.userService.GetUserDetails(loginid)
		if err != nil {
			res := utils.NotFound(1)
			response := utils.BuildResponse(res.Message, res.Code, utils.EmptyObj{})
			context.JSON(http.StatusNotFound, response)
		} else {
			res := utils.OK(4)
			response := utils.BuildResponse(res.Message, res.Code, user)
			context.JSON(http.StatusOK, response)
		}
	} else {
		user, err := c.userService.GetUserDetails(loginidParam)
		if err != nil {
			res := utils.NotFound(1)
			response := utils.BuildResponse(res.Message, res.Code, utils.EmptyObj{})
			context.JSON(http.StatusNotFound, response)
		} else {
			res := utils.OK(4)
			response := utils.BuildResponse(res.Message, res.Code, user)
			context.JSON(http.StatusOK, response)
		}
	}

}

func (c *userController) AddAddress(context *gin.Context) {
	var addressdto model.Useraddressdto
	errDTO := context.ShouldBindJSON(&addressdto)
	if errDTO != nil {
		res := utils.BadRequest()
		response := utils.BuildResponse(res.Message, res.Code, utils.EmptyObj{})
		context.JSON(http.StatusBadRequest, response)
	} else {
		authHeader := context.GetHeader("Authorization")
		token, errToken := c.jwt.ValidateToken(authHeader)
		if errToken != nil {
			res := utils.BadRequest()
			response := utils.BuildResponse(res.Message, res.Code, utils.EmptyObj{})
			context.JSON(http.StatusBadRequest, response)
		}
		claims := token.Claims.(jwt.MapClaims)
		loginid := fmt.Sprintf("%v", claims["loginid"])
		if loginid == "" {
			res := utils.NotFound(0)
			response := utils.BuildResponse(res.Message, res.Code, utils.EmptyObj{})
			context.JSON(http.StatusNotFound, response)
		}

		addressdto.Loginid = loginid

		address, err := c.userService.AddUserAddress(addressdto)
		if err != nil {
			res := utils.BadRequest()
			response := utils.BuildResponse(res.Message, res.Code, utils.EmptyObj{})
			context.JSON(http.StatusBadRequest, response)
		} else {
			res := utils.Created(2)
			response := utils.BuildResponse(res.Message, res.Code, address)
			context.JSON(http.StatusCreated, response)
		}
	}

}

func (c *userController) GetAddress(context *gin.Context) {
	authHeader := context.GetHeader("Authorization")
	token, errToken := c.jwt.ValidateToken(authHeader)
	if errToken != nil {
		res := utils.BadRequest()
		response := utils.BuildResponse(res.Message, res.Code, utils.EmptyObj{})
		context.JSON(http.StatusBadRequest, response)
	}
	claims := token.Claims.(jwt.MapClaims)
	loginid := fmt.Sprintf("%v", claims["loginid"])
	if loginid == "" {
		res := utils.NotFound(0)
		response := utils.BuildResponse(res.Message, res.Code, utils.EmptyObj{})
		context.JSON(http.StatusBadRequest, response)
	}
	address, err := c.userService.GetUserAddress(loginid)
	if err != nil {
		res := utils.NotFound(4)
		response := utils.BuildResponse(res.Message, res.Code, utils.EmptyObj{})
		context.JSON(http.StatusBadRequest, response)
	} else {
		res := utils.OK(3)
		response := utils.BuildResponse(res.Message, res.Code, address)
		context.JSON(http.StatusOK, response)
	}
}

func (c *userController) GetAllUsers(context *gin.Context) {
	roleid, err := strconv.ParseUint(context.Param("roleid"), 0, 0)
	if err != nil {
		res := utils.NotFound(6)
		response := utils.BuildResponse(res.Message, res.Code, utils.EmptyObj{})
		context.JSON(http.StatusBadRequest, response)
	}

	users, err := c.userService.GetAllUser(roleid)
	if err != nil {
		res := utils.NotFound(1)
		response := utils.BuildResponse(res.Message, res.Code, utils.EmptyObj{})
		context.JSON(http.StatusBadRequest, response)
	} else {
		res := utils.OK(4)
		response := utils.BuildResponse(res.Message, res.Code, users)
		context.JSON(http.StatusOK, response)
	}
}

func (c *userController) ResetPassword(context *gin.Context) {

	var loginDTO model.LoginDTO
	errDTO := context.ShouldBindJSON(&loginDTO)
	if errDTO != nil {
		res := utils.BadRequest()
		response := utils.BuildResponse(res.Message, res.Code, utils.EmptyObj{})
		context.AbortWithStatusJSON(http.StatusBadRequest, response)
		return
	}

	err := c.userService.ResetPassword(loginDTO)

	if err != nil {
		res := utils.BadRequest()
		response := utils.BuildResponse(res.Message, res.Code, utils.EmptyObj{})
		context.JSON(http.StatusBadRequest, response)
	} else {
		res := utils.OK(3)
		response := utils.BuildResponse(res.Message, res.Code, utils.EmptyObj{})
		context.JSON(http.StatusCreated, response)
	}

}
func (c *userController) UpdateVehicle(context *gin.Context) {
	var vehicleUpdateDTO model.UservehiclesupdateDTO
	vehicleregno := context.Param("vehicleregno")
	if vehicleregno == "" {
		res := utils.NotFound(2)
		response := utils.BuildResponse(res.Message, res.Code, utils.EmptyObj{})
		context.AbortWithStatusJSON(http.StatusBadRequest, response)
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
		res := utils.NotFound(0)
		response := utils.BuildResponse(res.Message, res.Code, utils.EmptyObj{})
		context.JSON(http.StatusBadRequest, response)
	}
	vehicleUpdateDTO.Userid = userid
	errDTO := context.ShouldBind(&vehicleUpdateDTO)
	if errDTO != nil {
		res := utils.BadRequest()
		response := utils.BuildResponse(res.Message, res.Code, utils.EmptyObj{})
		context.JSON(http.StatusBadRequest, response)
		return
	}

	result, err := c.userService.IsAllowedToUpdateDelete(userid, vehicleregno)

	if err != nil {
		res := utils.BadRequest()
		response := utils.BuildResponse(res.Message, res.Code, utils.EmptyObj{})
		context.JSON(http.StatusBadRequest, response)
	} else {
		if result {
			vehicle, err := c.userService.UpdateUserVehicle(vehicleUpdateDTO, vehicleregno)
			if err != nil {
				res := utils.NotFound(5)
				response := utils.BuildResponse(res.Message, res.Code, utils.EmptyObj{})
				context.JSON(http.StatusBadRequest, response)
			} else {
				res := utils.OK(1)
				response := utils.BuildResponse(res.Message, res.Code, vehicle)
				context.JSON(http.StatusOK, response)
			}
		} else {
			res := utils.Unauthorized(0)
			response := utils.BuildResponse(res.Message, res.Code, utils.EmptyObj{})
			context.JSON(http.StatusUnauthorized, response)
		}

	}

}

func (c *userController) UpdateUserDetails(context *gin.Context) {
	var userUpdatedto model.UpdateuserDTO
	authHeader := context.GetHeader("Authorization")
	token, errToken := c.jwt.ValidateToken(authHeader)
	if errToken != nil {
		res := utils.BadRequest()
		response := utils.BuildResponse(res.Message, res.Code, utils.EmptyObj{})
		context.JSON(http.StatusBadRequest, response)
	}
	claims := token.Claims.(jwt.MapClaims)
	loginid := fmt.Sprintf("%v", claims["loginid"])
	if loginid == "" {
		res := utils.NotFound(0)
		response := utils.BuildResponse(res.Message, res.Code, utils.EmptyObj{})
		context.JSON(http.StatusBadRequest, response)
	}

	userid, err := strconv.ParseUint(fmt.Sprintf("%v", claims["userid"]), 10, 64)
	if err != nil {
		res := utils.NotFound(7)
		response := utils.BuildResponse(res.Message, res.Code, utils.EmptyObj{})
		context.JSON(http.StatusBadRequest, response)
	}

	userUpdatedto.Userid = userid

	roleid, err := strconv.ParseUint(fmt.Sprintf("%v", claims["roleid"]), 10, 64)
	if err != nil {
		res := utils.NotFound(6)
		response := utils.BuildResponse(res.Message, res.Code, utils.EmptyObj{})
		context.JSON(http.StatusBadRequest, response)
	}

	userUpdatedto.Roleid = roleid

	errDTO := context.ShouldBind(&userUpdatedto)
	if errDTO != nil {
		res := utils.BadRequest()
		response := utils.BuildResponse(res.Message, res.Code, utils.EmptyObj{})
		context.JSON(http.StatusBadRequest, response)
		return
	}

	user, err := c.userService.UpdateUserDetails(userUpdatedto, loginid)

	if err != nil {
		res := utils.NotFound(1)
		response := utils.BuildResponse(res.Message, res.Code, utils.EmptyObj{})
		context.JSON(http.StatusBadRequest, response)
	} else {
		token := c.jwt.GenerateToken(user.Userid, user.Loginid, user.Roleid)
		user.Token = token
		res := utils.OK(1)
		response := utils.BuildResponse(res.Message, res.Code, user)
		context.JSON(http.StatusOK, response)
	}
}

func (c *userController) UpdateUserAddress(context *gin.Context) {
	var updateUseraddressdto model.Updateuseraddressdto
	addressid, err := strconv.ParseUint(context.Param("addressid"), 0, 0)
	if err != nil {
		res := utils.NotFound(2)
		response := utils.BuildResponse(res.Message, res.Code, utils.EmptyObj{})
		context.JSON(http.StatusBadRequest, response)
	}

	errDTO := context.ShouldBind(&updateUseraddressdto)
	if errDTO != nil {
		res := utils.BadRequest()
		response := utils.BuildResponse(res.Message, res.Code, utils.EmptyObj{})
		context.JSON(http.StatusBadRequest, response)
		return
	}

	address, err := c.userService.UpdateUserAddress(updateUseraddressdto, addressid)
	if err != nil {
		res := utils.NotFound(0)
		response := utils.BuildResponse(res.Message, res.Code, utils.EmptyObj{})
		context.JSON(http.StatusBadRequest, response)
	} else {
		res := utils.OK(1)
		response := utils.BuildResponse(res.Message, res.Code, address)
		context.JSON(http.StatusOK, response)
	}
}
