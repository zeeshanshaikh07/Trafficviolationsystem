package middleware

import (
	"log"
	"net/http"

	"violationdetails/service"
	"violationdetails/utils"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
)

func AuthorizeJWT(jwtService service.JWTService) gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			response := utils.BuildResponse("No token found", 404, nil)
			c.AbortWithStatusJSON(http.StatusBadRequest, response)
			return
		}
		token, err := jwtService.ValidateToken(authHeader)
		if token.Valid {
			claims := token.Claims.(jwt.MapClaims)
			log.Println("Claim[issuer] :", claims["issuer"])
		} else {
			log.Println(err)
			response := utils.BuildResponse("Token is not valid", 404, nil)
			c.AbortWithStatusJSON(http.StatusUnauthorized, response)
		}
	}
}
