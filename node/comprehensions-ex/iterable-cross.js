// Array comprehensions
// https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Operators/Array_comprehensions

// [for (x of iterable) x]
// [for (x of iterable) if (condition) x]
// [for (x of iterable) for (y of iterable) x + y]

(function () {
	'use strict';

	module.exports = cross;

	function cross() {
		var args = this instanceof Array ? [this] : [];
		[].push.apply(args, arguments);

		var res = args[0];
		if (!(res instanceof Array)) res = Array.from(res);
		for (var n = 1; n < args.length; ++n) {
			var a = res, b = args[n], res = [];
			if (typeof b === 'function') {
				//res = a.map(v => b.apply(null, v instanceof Array ? v : [v]));
				for (var v of a)
					res.push(b.apply(null, v instanceof Array ? v : [v]));
				//for (var v of a)
				//	res.push(b.apply(null, [].concat(v)));
			}
			else {
				if (!(b instanceof Array)) b = Array.from(b);
				for (var i of a)
					for (var j of b)
						res.push([].concat(i, j));
			}
		}
		return res;
	}

	function iter2array(iter) {
		return Array.from(iter);
		//return iter.toArray();
		var res = [];
		for (var v of iter)
			res.push(v);
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
