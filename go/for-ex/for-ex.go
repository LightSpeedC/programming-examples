package main

import "fmt"

func main() {
  for i := 0; i < 10; i++ {
    if i == 3 { continue }
    if i == 8 { break }
    fmt.Println(i)
  }

  fmt.Println("====")

  x := 0
  for x < 10 {
    fmt.Println(x)
    x++
  }

  fmt.Println("====")

  y := 0
  for {
    fmt.Println(y)
    y++
    if y == 10 { break }
  }
}
