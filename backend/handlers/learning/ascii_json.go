package learning

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func AsciiJSON(c *gin.Context) {
	data := gin.H{
		"lang": "Go語言",
		"tag":  "<br>",
	}

	c.AsciiJSON(http.StatusOK, data)
}
