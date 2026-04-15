package auth

import (
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
)

var jwtSecret = []byte("fleetify-super-secret-key")

type LoginData struct {
	Token string `json:"token"`
	Role  string `json:"role"`
}

type LoginResponse struct {
	Status string    `json:"status"`
	Data   LoginData `json:"data"`
	Meta   struct {
		Timestamp time.Time `json:"timestamp"`
	} `json:"meta"`
}

type ErrorResponse struct {
	Status string `json:"status"`
	Error  struct {
		Code    string `json:"code"`
		Message string `json:"message"`
	} `json:"error"`
}

func LoginHandler(c *fiber.Ctx) error {
	type LoginRequest struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}

	var req LoginRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{
			"status": "error",
			"error": fiber.Map{
				"code":    "INVALID_REQUEST",
				"message": "Invalid request format. Required: username, password",
			},
		})
	}

	if req.Username == "" || req.Password == "" {
		return c.Status(400).JSON(fiber.Map{
			"status": "error",
			"error": fiber.Map{
				"code":    "MISSING_FIELD",
				"message": "Username and password are required",
			},
		})
	}

	var role string
	if req.Username == "admin" && req.Password == "admin123" {
		role = "Admin"
	} else if req.Username == "kerani" && req.Password == "kerani123" {
		role = "Kerani"
	} else {
		return c.Status(401).JSON(fiber.Map{
			"status": "error",
			"error": fiber.Map{
				"code":    "INVALID_CREDENTIALS",
				"message": "Username or password is incorrect",
			},
		})
	}

	claims := jwt.MapClaims{
		"username": req.Username,
		"role":     role,
		"exp":      time.Now().Add(time.Hour * 24).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(jwtSecret)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"status": "error",
			"error": fiber.Map{
				"code":    "TOKEN_GENERATION_FAILED",
				"message": "Failed to generate authentication token",
			},
		})
	}

	resp := LoginResponse{
		Status: "success",
		Data: LoginData{
			Token: tokenString,
			Role:  role,
		},
	}
	resp.Meta.Timestamp = time.Now()

	return c.JSON(resp)
}
