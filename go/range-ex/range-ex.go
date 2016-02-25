package main

import "fmt"

func main() {
  s := []int {7, 8, 9}
  for index, v := range s {
    fmt.Println(index, v)
  }

  for _, v := range s {
    fmt.Println(v)
  }

  m := map[string]int{"japan":100, "ame": 300}
  for key, val := range m {
    fmt.Println(key, val)
  }
}
