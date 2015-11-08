// Array comprehensions
// https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Operators/Array_comprehensions

// [for (x of iterable) x]
// [for (x of iterable) if (condition) x]
// [for (x of iterable) for (y of iterable) x + y]


var cross = require('./array-cross');

var a = [1, 2, 3], b = [4, 5, 6], c = [7, 8, 9];

console.log('\n a.map(function(x){return x * x})\n',
				a.map(function(x){return x * x}));
console.log('\n cross(a, function(x){return x * x})\n',
				cross(a, function(x){return x * x}));
console.log('\n cross(a, b)\n',
				cross(a, b));
console.log('\n cross(a, b, function(x, y){return [x, y]})\n',
				cross(a, b, function(x, y){return [x, y]}));
console.log('\n cross(a, b, function(x, y){return x * y})\n',
				cross(a, b, function(x, y){return x * y}));
console.log('\n cross(a, b).map(function(x){return x[0] * x[1]})\n',
				cross(a, b).map(function(x){return x[0] * x[1]}));
console.log('\n cross(a, b, c)\n',
				cross(a, b, c));
console.log('\n cross(a, b, c, function(x, y, z){return [x, y, z]})\n',
				cross(a, b, c, function(x, y, z){return [x, y, z]}));

console.log('\n a.cross(b)\n',
				a.cross(b));
console.log('\n a.cross(b, function(x, y){return x * y})\n',
				a.cross(b, function(x, y){return x * y}));
console.log('\n a.cross(b).map(function(x){return x[0] * x[1]})\n',
				a.cross(b).map(function(x){return x[0] * x[1]}));
console.log('\n a.cross(b).cross(c)\n',
				a.cross(b).cross(c));
console.log('\n a.cross(b, c)\n',
				a.cross(b, c));
