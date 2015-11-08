// Array comprehensions
// https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Operators/Array_comprehensions

// [for (x of iterable) x]
// [for (x of iterable) if (condition) x]
// [for (x of iterable) for (y of iterable) x + y]


var cross = require('./array-cross');

var a = [1, 2, 3], b = [4, 5, 6], c = [7, 8, 9];
function *ga() { for (var v of a) yield v; }
function *gb() { for (var v of b) yield v; }
function *gc() { for (var v of c) yield v; }

for (var i of a) console.log('i of a', i);
for (var i of ga()) console.log('i of ga', i);

console.log('\n a.map(x => x * x)\n',
				a.map(x => x * x));
console.log('\n cross(a, x => x * x)\n',
				cross(a, x => x * x));
console.log('\n cross(a, b)\n',
				cross(a, b));
console.log('\n cross(a, gb())\n',
				cross(a, gb()));
console.log('\n cross(ga(), b)\n',
				cross(ga(), b));
console.log('\n cross(ga(), gb())\n',
				cross(ga(), gb()));
console.log('\n cross(ga(), gb(), (x, y) => [x, y])\n',
				cross(ga(), gb(), (x, y) => [x, y]));
console.log('\n cross(ga(), gb(), (x, y) => x * y)\n',
				cross(ga(), gb(), (x, y) => x * y));
console.log('\n cross(ga(), gb()).map(x => x[0] * x[1])\n',
				cross(ga(), gb()).map(x => x[0] * x[1]));
console.log('\n cross(ga(), gb(), gc())\n',
				cross(ga(), gb(), gc()));
console.log('\n cross(ga(), gb(), gc(), (x, y, z) => [x, y, z])\n',
				cross(ga(), gb(), gc(), (x, y, z) => [x, y, z]));

console.log('\n a.cross(b)\n',
				a.cross(b));
console.log('\n ga().cross(b)\n',
				ga().cross(b));
console.log('\n a.cross(gb())\n',
				a.cross(gb()));
console.log('\n ga().cross(gb())\n',
				ga().cross(gb()));
console.log('\n a.cross(b, (x, y) => x * y)\n',
				a.cross(b, (x, y) => x * y));
console.log('\n ga().cross(b, (x, y) => x * y)\n',
				ga().cross(b, (x, y) => x * y));
console.log('\n a.cross(gb(), (x, y) => x * y)\n',
				a.cross(gb(), (x, y) => x * y));
console.log('\n ga().cross(gb(), (x, y) => x * y)\n',
				ga().cross(gb(), (x, y) => x * y));
console.log('\n a.cross(b).map(x => x[0] * x[1])\n',
				a.cross(b).map(x => x[0] * x[1]));
console.log('\n a.cross(b).cross(c)\n',
				a.cross(b).cross(c));
console.log('\n a.cross(b, c)\n',
				a.cross(b, c));
console.log('\n ga().cross(gb(), gc())\n',
				ga().cross(gb(), gc()));

