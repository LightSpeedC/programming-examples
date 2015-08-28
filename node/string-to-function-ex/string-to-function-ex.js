// http://qiita.com/yaegaki/items/79a552f205120c3a94d2

String.prototype.fn = function () { return Function('$0,$1,$2,$3,$4,$5,$6,$7,$8,$9', 'return ' + this); };
Object.defineProperty(String.prototype, 'func', {
	get: function () { return Function('$0,$1,$2,$3,$4,$5,$6,$7,$8,$9', 'return ' + this); }});

console.log('$0 * $0'.fn()(8));
console.log('$0 * $0'.func(8));

var square1 = '$0 * $0'.fn();
var square2 = '$0 * $0'.func;

console.log(square1(8));
console.log(square2(8));
