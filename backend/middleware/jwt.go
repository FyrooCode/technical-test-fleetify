package middleware

import (
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
)

var jwtSecret = []byte("fleetify-super-secret-key")

func JWTProtected(c *fiber.Ctx) error {
	authHeader := c.Get("Authorization")
	if authHeader == "" {
		return c.Status(401).JSON(fiber.Map{
			"status": "error",
			"error": fiber.Map{
				"code":    "MISSING_TOKEN",
				"message": "Authorization token not found",
			},
		})
	}

	tokenString := strings.Replace(authHeader, "Bearer ", "", 1)

	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		return jwtSecret, nil
	})

	if err != nil || !token.Valid {
		return c.Status(401).JSON(fiber.Map{
			"status": "error",
			"error": fiber.Map{
				"code":    "INVALID_TOKEN",
				"message": "Token is invalid or expired",
			},
		})
	}

	claims := token.Claims.(jwt.MapClaims)
	c.Locals("user_role", claims["role"])
	c.Locals("username", claims["username"])

	return c.Next()
}
