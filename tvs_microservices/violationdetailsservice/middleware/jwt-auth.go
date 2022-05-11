package middleware

import (
	"log"
	"net/http"

	"violationdetails/service"
	"violationdetails/utils"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
)

//this function is used to validates the token author given and also used to extract author id from the token, return 401 if not valid
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
			log.Println("Claim[author_id]: ", claims["author_id"])
			log.Println("Claim[issuer] :", claims["issuer"])
		} else {
			log.Println(err)
			response := utils.BuildResponse("Token is not valid", 404, nil)
			c.AbortWithStatusJSON(http.StatusUnauthorized, response)
		}
	}
}
