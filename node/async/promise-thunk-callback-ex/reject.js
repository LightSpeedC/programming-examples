'use strict';

function reject(err) {
	return new this(function (res, rej) {
		rej(err);
	}, true);
} // reject

if (typeof module === 'object' && module && module.exports)
	module.exports = reject;
