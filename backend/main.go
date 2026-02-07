package main

import (
	"go-lab/router"
)

func main() {
	r := router.SetupRouter()

	// Start server on port 8080 (default)
	// Server will listen on 0.0.0.0:8080 (localhost:8080 on Windows)
	r.Run()
}
