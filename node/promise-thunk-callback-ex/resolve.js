'use strict';

function resolve(val) {
	return new this(function (res, rej) {
		res(val);
	}, true);
} // resolve

if (typeof module === 'object' && module && module.exports)
	module.exports = resolve;
