package middleware

import (
	"log"
	"net/http"

	"github.com/zeeshanshaikh07/tvs_utils/utils"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
)

func AuthorizeJWT(jwtService utils.JWT) gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			response := utils.BuildResponse("No token found!", 404, nil)
			c.AbortWithStatusJSON(http.StatusBadRequest, response)
			return
		}
		token, err := jwtService.ValidateToken(authHeader)
		if token.Valid {
			claims := token.Claims.(jwt.MapClaims)
			log.Println("Claim[userid]: ", claims["userid"])
		} else {
			log.Println(err)
			response := utils.BuildResponse("Token is not valid!", 404, nil)
			c.AbortWithStatusJSON(http.StatusUnauthorized, response)
		}
	}
}
