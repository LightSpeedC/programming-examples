// Array comprehensions
// https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Operators/Array_comprehensions

// [for (x of iterable) x]
//   cross(iterable)
//   array.cross()
//   Array.from(iterable)

// [for (x of iterable) if (condition) x]
//   cross(iterable).filter(condition)
//   array.filter(condition)

// [for (x of iterable1) for (y of iterable2) x + y]
//   cross(iterable1, iterable2, (x, y) => x + y)
//   array1.cross(iterable2, (x, y) => x + y)

(function () {
	'use strict';

	module.exports = cross;

	if (!Array.prototype.cross)
		Object.defineProperty(Array.prototype, 'cross',
			{value: cross, configurable: true});

	try {
		var proto = eval('(function *(){}()).constructor.prototype');
		console.log(Object.getOwnPropertyNames(proto));
		if (!proto.cross)
			Object.defineProperty(proto, 'cross',
				{value: cross, configurable: true});
		console.log(Object.getOwnPropertyNames(proto));
	} catch (e) {}

	function cross() {
		var args = this instanceof Array ? [this] : [];
		[].push.apply(args, arguments);

		var res = args[0];
		if (!(res instanceof Array)) res = Array.from(res);
		for (var n = 1; n < args.length; ++n) {
			var a = res, b = args[n], res = [];
			if (typeof b === 'function') {
				res = a.map(function(v){return b.apply(null, v instanceof Array ? v : [v])});
			}
			else {
				if (!(b instanceof Array)) b = Array.from(b);
				for (var i in a)
					for (var j in b)
						res.push([].concat(a[i], b[j]));
			}
		}
		return res;
	}

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

})();
