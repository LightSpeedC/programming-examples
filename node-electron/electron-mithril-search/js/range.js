'use strict';

module.exports = range;

// range 0～n-1までの数字の配列
function range(n) {
	const arr = new Array(n);
	for (let i = 0; i < n; ++i) arr[i] = i;
	return arr;
}
