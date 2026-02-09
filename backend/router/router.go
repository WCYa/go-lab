package router

import (
	"go-lab/handlers"
	"go-lab/handlers/learning"
	"net/http"

	"github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {
	// Create a Gin router with default middleware (logger and recovery)
	r := gin.Default()

	r.GET("/health", handlers.Health)

	api := r.Group("/api")
	{
		// Define a simple GET endpoint
		api.GET("/ping", func(c *gin.Context) {
			// Return JSON response
			c.JSON(http.StatusOK, gin.H{
				"message": "pong",
			})
		})

		l := api.Group("/learning")
		{
			l.GET("/someJSON", learning.AsciiJSON)
			l.POST("/bindBodyOnce", learning.BindBodyOnlyOnce)
			l.POST("/bindBodyMultiple", learning.BindBodyMultipleTimes)
			l.POST("/BindDefaultsForForm", learning.BindDefaultsForForm)
			l.POST("/BindFormToCustomStructB", learning.GetDataB)
			l.POST("/BindFormToCustomStructC", learning.GetDataC)
			l.POST("/BindFormToCustomStructD", learning.GetDataD)
		}
	}

	return r
}
