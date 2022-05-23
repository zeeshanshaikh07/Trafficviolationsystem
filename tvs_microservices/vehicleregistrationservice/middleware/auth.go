package middleware

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"trafficsystem.com/vehicleregistrationservice/service"
)

const (
	AuthorizationHeaderKey  = "authorization"
	AuthorizationPayloadKey = "authorization_payload"
)

func AuthMiddleware(s service.JWTService) gin.HandlerFunc {
	return func(ctx *gin.Context) {

		authHeader := ctx.GetHeader("Authorization")

		payload, err := s.VerifyToken(authHeader)
		if err != nil {
			fmt.Println("Verify token error ", err, payload)
			ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"Error": err})
			return
		}

		fmt.Println("Got payload ", payload)

		ctx.Set(AuthorizationPayloadKey, payload)
		ctx.Next()
	}
}
