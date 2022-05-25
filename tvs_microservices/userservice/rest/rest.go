package rest

import (
	"fmt"
	"net/http"
	"strconv"

	"trafficviolationsystem/userservice/model"

	"github.com/KadirSheikh/tvs_utils/middleware"

	"github.com/KadirSheikh/tvs_utils/utils"

	"github.com/gin-gonic/gin"

	"github.com/go-resty/resty/v2"
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

func (c *userController) Login(context *gin.Context) {
	var loginDTO model.LoginDTO
	errDTO := context.ShouldBind(&loginDTO)
	if errDTO != nil {
		res := utils.BadRequest()
		response := utils.BuildResponse(res.Message, res.Code, utils.EmptyObj{})
		context.AbortWithStatusJSON(http.StatusBadRequest, response)
		return
	}
	userResult := c.userService.VerifyCredential(loginDTO.Loginid, loginDTO.Password)
	if v, ok := userResult.(model.User); ok {
		res := utils.OK(0)
		generatedToken := c.jwt.GenerateToken(v.Userid, v.Loginid, v.Roleid)
		v.Token = generatedToken
		response := utils.BuildResponse(res.Message, res.Code, v)
		context.JSON(http.StatusOK, response)
		return
	}
	res := utils.Unauthorized(1)
	response := utils.BuildResponse(res.Message, res.Code, utils.EmptyObj{})
	context.AbortWithStatusJSON(http.StatusUnauthorized, response)
}

func (c *userController) Register(context *gin.Context) {
	var registerDTO model.RegisterDTO
	errDTO := context.ShouldBind(&registerDTO)
	if errDTO != nil {
		res := utils.BadRequest()
		response := utils.BuildResponse(res.Message, res.Code, utils.EmptyObj{})
		context.AbortWithStatusJSON(http.StatusBadRequest, response)
		return
	}

	if !c.userService.IsDuplicateUsername(registerDTO.Loginid) {
		res := utils.Conflict(0)
		response := utils.BuildResponse(res.Message, res.Code, utils.EmptyObj{})
		context.AbortWithStatusJSON(http.StatusConflict, response)
		return
	} else if !c.userService.IsDuplicateEmail(registerDTO.Emailid) {
		res := utils.Conflict(1)
		response := utils.BuildResponse(res.Message, res.Code, utils.EmptyObj{})
		context.AbortWithStatusJSON(http.StatusConflict, response)
		return
	} else {

		createdUser, err := c.userService.RegisterUser(registerDTO)
		if err != nil {
			res := utils.BadRequest()
			response := utils.BuildResponse(res.Message, res.Code, utils.EmptyObj{})
			context.AbortWithStatusJSON(http.StatusBadRequest, response)
			return
		} else {
			res := utils.Created(0)
			token := c.jwt.GenerateToken(createdUser.Userid, createdUser.Loginid, createdUser.Roleid)
			createdUser.Token = token
			response := utils.BuildResponse(res.Message, res.Code, createdUser)
			context.JSON(http.StatusCreated, response)
		}

	}
}

func (c *userController) AddVehicle(context *gin.Context) {
	client := resty.New()
	var userVehicleDTO model.UservehiclesDTO
	errDTO := context.ShouldBind(&userVehicleDTO)
	if errDTO != nil {
		res := utils.BadRequest()
		response := utils.BuildResponse(res.Message, res.Code, utils.EmptyObj{})
		context.AbortWithStatusJSON(http.StatusBadRequest, response)
		return
	} else {
		userid, err := strconv.ParseUint(fmt.Sprintf("%v", context.MustGet(middleware.Userid)), 10, 64)
		if err == nil {
			userVehicleDTO.Userid = userid
		}

		loginid := fmt.Sprintf("%v", context.MustGet(middleware.Loginid))

		userVehicleDTO.Loginid = loginid

		vToken := c.jwt.GenerateServiceValidationToken(userVehicleDTO.Chassisno, userVehicleDTO.Regno)
		resp, err := client.R().
			SetQueryParams(map[string]string{
				"vehicleregno": userVehicleDTO.Regno,
			}).
			SetHeader("Authorization", vToken).
			Get("http://localhost:9001/api/v1/vehicle/registration")

		if err != nil {
			fmt.Println("code : ", utils.StatusCodes[utils.ErrInvalidAuthorizeHeader], utils.ErrInvalidAuthorizeHeader)
			return
		}

		if resp.StatusCode() == http.StatusOK {
			result, err := c.userService.AddVehicle(userVehicleDTO)

			if err != nil {
				res := utils.Conflict(2)
				response := utils.BuildResponse(res.Message, res.Code, utils.EmptyObj{})
				context.AbortWithStatusJSON(http.StatusConflict, response)
				return
			} else {
				result.Vtoken = vToken
				res := utils.Created(1)
				response := utils.BuildResponse(res.Message, res.Code, result)
				context.JSON(http.StatusCreated, response)
			}
		} else {

			response := utils.BuildResponse("Invalid Vehicle", resp.StatusCode(), utils.EmptyObj{})
			context.AbortWithStatusJSON(http.StatusBadRequest, response)
			return
		}

	}
}

func (c *userController) AllVehicles(context *gin.Context) {

	loginid := fmt.Sprintf("%v", context.MustGet(middleware.Loginid))
	loginidParam := context.Query("loginid")
	if loginidParam == "" {
		uservehicles, err := c.userService.GetAllUserVehicles(loginid)
		if err != nil {
			res := utils.NotFound(5)
			response := utils.BuildResponse(res.Message, res.Code, utils.EmptyObj{})
			context.AbortWithStatusJSON(http.StatusNotFound, response)
			return
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
			context.AbortWithStatusJSON(http.StatusNotFound, response)
			return
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
		context.AbortWithStatusJSON(http.StatusNotFound, response)
		return
	}
	vehicle.Regno = regno

	if c.userService.DeleteUserVehicle(vehicle) != nil {
		res := utils.NotFound(5)
		response := utils.BuildResponse(res.Message, res.Code, utils.EmptyObj{})
		context.AbortWithStatusJSON(http.StatusNotFound, response)
		return
	} else {
		res := utils.OK(2)
		response := utils.BuildResponse(res.Message, res.Code, utils.EmptyObj{})
		context.JSON(http.StatusOK, response)
	}

}

func (c *userController) UserDetails(context *gin.Context) {
	loginid := fmt.Sprintf("%v", context.MustGet(middleware.Loginid))

	loginidParam := context.Query("loginid")
	if loginidParam == "" {
		user, err := c.userService.GetUserDetails(loginid)
		if err != nil {
			res := utils.NotFound(1)
			response := utils.BuildResponse(res.Message, res.Code, utils.EmptyObj{})
			context.AbortWithStatusJSON(http.StatusNotFound, response)
			return
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
			context.AbortWithStatusJSON(http.StatusNotFound, response)
			return
		} else {
			res := utils.OK(4)
			response := utils.BuildResponse(res.Message, res.Code, user)
			context.JSON(http.StatusOK, response)
		}
	}

}

func (c *userController) GetVToken(context *gin.Context) {
	vehregno := context.Query("vehregno")
	if vehregno == "" {
		res := utils.NotFound(2)
		response := utils.BuildResponse(res.Message, res.Code, utils.EmptyObj{})
		context.AbortWithStatusJSON(http.StatusNotFound, response)
		return
	}

	chassisno := context.Query("chassisno")
	if chassisno == "" {
		res := utils.NotFound(2)
		response := utils.BuildResponse(res.Message, res.Code, utils.EmptyObj{})
		context.AbortWithStatusJSON(http.StatusNotFound, response)
		return
	}

	vToken := c.jwt.GenerateServiceValidationToken(chassisno, vehregno)
	res := utils.OK(8)
	response := utils.BuildResponse(res.Message, res.Code, vToken)
	context.JSON(http.StatusCreated, response)
}

func (c *userController) AddAddress(context *gin.Context) {
	var addressdto model.Useraddressdto
	errDTO := context.ShouldBindJSON(&addressdto)
	if errDTO != nil {
		res := utils.BadRequest()
		response := utils.BuildResponse(res.Message, res.Code, utils.EmptyObj{})
		context.AbortWithStatusJSON(http.StatusBadRequest, response)
		return
	} else {
		loginid := fmt.Sprintf("%v", context.MustGet(middleware.Loginid))

		addressdto.Loginid = loginid

		address, err := c.userService.AddUserAddress(addressdto)
		if err != nil {
			res := utils.BadRequest()
			response := utils.BuildResponse(res.Message, res.Code, utils.EmptyObj{})
			context.AbortWithStatusJSON(http.StatusBadRequest, response)
			return
		} else {
			res := utils.Created(2)
			response := utils.BuildResponse(res.Message, res.Code, address)
			context.JSON(http.StatusCreated, response)
		}
	}

}

func (c *userController) GetAddress(context *gin.Context) {
	loginid := fmt.Sprintf("%v", context.MustGet(middleware.Loginid))

	loginidParam := context.Query("loginid")
	if loginidParam == "" {
		address, err := c.userService.GetUserAddress(loginid)
		if err != nil {
			res := utils.NotFound(4)
			response := utils.BuildResponse(res.Message, res.Code, utils.EmptyObj{})
			context.AbortWithStatusJSON(http.StatusNotFound, response)
			return
		} else {
			res := utils.OK(3)
			response := utils.BuildResponse(res.Message, res.Code, address)
			context.JSON(http.StatusOK, response)
		}
	} else {
		address, err := c.userService.GetUserAddress(loginidParam)
		if err != nil {
			res := utils.NotFound(4)
			response := utils.BuildResponse(res.Message, res.Code, utils.EmptyObj{})
			context.AbortWithStatusJSON(http.StatusNotFound, response)
			return
		} else {
			res := utils.OK(3)
			response := utils.BuildResponse(res.Message, res.Code, address)
			context.JSON(http.StatusOK, response)
		}
	}

}

func (c *userController) GetAllUsers(context *gin.Context) {
	roleid, err := strconv.ParseUint(context.Param("roleid"), 0, 0)
	if err != nil {
		res := utils.NotFound(6)
		response := utils.BuildResponse(res.Message, res.Code, utils.EmptyObj{})
		context.AbortWithStatusJSON(http.StatusNotFound, response)
		return
	}

	users, err := c.userService.GetAllUser(roleid)
	if err != nil {
		res := utils.NotFound(1)
		response := utils.BuildResponse(res.Message, res.Code, utils.EmptyObj{})
		context.AbortWithStatusJSON(http.StatusNotFound, response)
		return
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
		context.AbortWithStatusJSON(http.StatusBadRequest, response)
		return
	} else {
		res := utils.OK(3)
		response := utils.BuildResponse(res.Message, res.Code, utils.EmptyObj{})
		context.JSON(http.StatusCreated, response)
	}

}

func (c *userController) UpdateUserDetails(context *gin.Context) {
	var userUpdatedto model.UpdateuserDTO
	loginid := fmt.Sprintf("%v", context.MustGet(middleware.Loginid))

	userid, err := strconv.ParseUint(fmt.Sprintf("%v", context.MustGet(middleware.Userid)), 10, 64)
	if err != nil {
		res := utils.NotFound(0)
		response := utils.BuildResponse(res.Message, res.Code, utils.EmptyObj{})
		context.AbortWithStatusJSON(http.StatusNotFound, response)
		return
	}
	userUpdatedto.Userid = userid

	roleid, err := strconv.ParseUint(fmt.Sprintf("%v", context.MustGet(middleware.Roleid)), 10, 64)
	if err != nil {
		res := utils.NotFound(6)
		response := utils.BuildResponse(res.Message, res.Code, utils.EmptyObj{})
		context.AbortWithStatusJSON(http.StatusNotFound, response)
		return
	}

	userUpdatedto.Roleid = roleid

	errDTO := context.ShouldBind(&userUpdatedto)
	if errDTO != nil {
		res := utils.BadRequest()
		response := utils.BuildResponse(res.Message, res.Code, utils.EmptyObj{})
		context.AbortWithStatusJSON(http.StatusBadRequest, response)
		return
	}

	user, err := c.userService.UpdateUserDetails(userUpdatedto, loginid)

	if err != nil {
		res := utils.NotFound(1)
		response := utils.BuildResponse(res.Message, res.Code, utils.EmptyObj{})
		context.AbortWithStatusJSON(http.StatusNotFound, response)
		return
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
		context.AbortWithStatusJSON(http.StatusNotFound, response)
		return
	}

	errDTO := context.ShouldBind(&updateUseraddressdto)
	if errDTO != nil {
		res := utils.BadRequest()
		response := utils.BuildResponse(res.Message, res.Code, utils.EmptyObj{})
		context.AbortWithStatusJSON(http.StatusBadRequest, response)
		return
	}

	address, err := c.userService.UpdateUserAddress(updateUseraddressdto, addressid)
	if err != nil {
		res := utils.NotFound(0)
		response := utils.BuildResponse(res.Message, res.Code, utils.EmptyObj{})
		context.AbortWithStatusJSON(http.StatusNotFound, response)
		return
	} else {
		res := utils.OK(1)
		response := utils.BuildResponse(res.Message, res.Code, address)
		context.JSON(http.StatusOK, response)
	}
}
