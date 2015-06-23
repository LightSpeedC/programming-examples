function fn(o) {
  return (o instanceof Array) + '\t' +
    (!!o && o.constructor == Array) + '\t' +
    typeof o + '\t' +
    Object.prototype.toString.call(o);
}

//空の配列
console.log(fn([]))
//結果:"[object Object]"

//空のオブジェクト
console.log(fn({}))
//結果:"[object Object]"

//文字列
console.log(fn("a"))
//結果:"[object String]"

//数値
console.log(fn(1))
//結果:"[object Number]"

//null
console.log(fn(null))
//結果:"[object Null]"

//undefined
console.log(fn(undefined))
//結果:"[object Undefined]"

//Boolean
console.log(fn(true))
//結果:"[object Boolean]"

//Function
console.log(fn(function(){}))
//結果:"[object Function]"

//正規表現
console.log(fn(/abc/))
//結果:"[object RegExp]"
