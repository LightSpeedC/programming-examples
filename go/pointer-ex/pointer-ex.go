package main

import "fmt"

func main() {
  a := 5
  var pa *int
  pa = &a //aのアドレス
  fmt.Println(pa)
  fmt.Println(*pa) //*paはpaの領域にあるデータの値
}
