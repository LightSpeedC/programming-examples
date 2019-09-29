// Array comprehensions
// https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Operators/Array_comprehensions

// [for (x of iterable) x]
// [for (x of iterable) if (condition) x]
// [for (x of iterable) for (y of iterable) x + y]


var cross = require('./cross-array');

var a = [1, 2, 3], b = [4, 5, 6], c = [7, 8, 9];

console.log('\n a.map(x => x * x)\n',
				a.map(x => x * x));
console.log('\n cross(a, x => x * x)\n',
				cross(a, x => x * x));
console.log('\n cross(a, b)\n',
				cross(a, b));
console.log('\n cross(a, b, (x, y) => [x, y])\n',
				cross(a, b, (x, y) => [x, y]));
console.log('\n cross(a, b, (x, y) => x * y)\n',
				cross(a, b, (x, y) => x * y));
console.log('\n cross(a, b).map(x => x[0] * x[1])\n',
				cross(a, b).map(x => x[0] * x[1]));
console.log('\n cross(a, b, c)\n',
				cross(a, b, c));
console.log('\n cross(a, b, c, (x, y, z) => [x, y, z])\n',
				cross(a, b, c, (x, y, z) => [x, y, z]));

var cross = require('./cross-array').extendPrototype();

console.log('\n a.cross(b)\n',
				a.cross(b));
console.log('\n a.cross(b, (x, y) => x * y)\n',
				a.cross(b, (x, y) => x * y));
console.log('\n a.cross(b).map(x => x[0] * x[1])\n',
				a.cross(b).map(x => x[0] * x[1]));
console.log('\n a.cross(b).cross(c)\n',
				a.cross(b).cross(c));
console.log('\n a.cross(b, c)\n',
				a.cross(b, c));

function *ga() { for (var v of a) yield v; }
function *gb() { for (var v of b) yield v; }
function *gc() { for (var v of c) yield v; }


	/*
	function cross2(a, b, f) {
		var res = [];
		for (var i in a)
			for (var j in b)
				res.push(f(a[i], b[j]));
		return res;
	}

	function cross3(a, b, c, f) {
		var res = [];
		for (var i in a)
			for (var j in b)
				for (var k in c)
					res.push(f(a[i], b[j], c[k]));
		return res;
	}
	*/
