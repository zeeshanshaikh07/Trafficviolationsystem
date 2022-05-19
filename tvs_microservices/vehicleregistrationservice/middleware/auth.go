package middleware

import (
	"errors"
	"fmt"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"trafficsystem.com/vehicleregistrationservice/service"
)

const (
	AuthorizationHeaderKey  = "authorization"
	AuthorizationPayloadKey = "authorization_payload"
)

// AuthMiddleware creates a gin middleware for authorization
func AuthMiddleware(s service.JWTService) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		fmt.Println("Inside auth middleware")
		authorizationHeader := ctx.GetHeader(AuthorizationHeaderKey)

		fmt.Println("Inside auth middleware", authorizationHeader)

		if len(authorizationHeader) == 0 {
			err := errors.New("authorization header is not provided")
			ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"Error": err})
			fmt.Println("Error 1 ", err)
			return
		}

		fields := strings.Fields(authorizationHeader)
		fmt.Println("Fields ", fields)
		if len(fields) < 2 {
			err := errors.New("invalid authorization header format")
			ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"Error": err})
			fmt.Println("Error 2 ", err, fields)
			return
		}

		accessToken := fields[1]
		payload, err := s.VerifyToken(accessToken)
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
