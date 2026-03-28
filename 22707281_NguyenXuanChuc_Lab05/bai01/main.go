package main

import (
	"fmt"
	"time"
)

func main() {
	fmt.Println("=== GO APPLICATION STARTED ===")
	fmt.Println("Hello, Docker World! This is an optimized image.")
	
	// Giữ container chạy để chúng ta có thể kiểm tra
	for {
		time.Sleep(1 * time.Hour)
	}
}