'use strict';

function memoize(f) {
	var memo = {};
	return function (x, y, z) {
		const args = [x, y, z].join('.');
		return memo[args] ? memo[args] : memo[args] = f(x, y, z);
	};
}

const taraiX = (x, y, z) => x <= y ? y :
		tarai(
			tarai(x - 1, y, z),
			tarai(y - 1, z, x),
			tarai(z - 1, x, y));

const tarai = memoize(taraiX);

const bench = require('./bench');
bench('takeuchi tarai', tarai, 10, 5, 0);
bench('takeuchi tarai', tarai, 12, 6, 0);
bench('takeuchi tarai', tarai, 14, 7, 0);
bench('takeuchi tarai', tarai, 16, 8, 0);
bench('takeuchi tarai', tarai, 100, 50, 0);
bench('takeuchi tarai', tarai, 1000, 500, 0);
bench('takeuchi tarai', tarai, 5000, 2500, 0);
