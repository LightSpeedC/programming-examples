'use strict';

function wait(msec, val) {
	return new this(function (res, rej) {
		setTimeout(res, msec, val);
	});
} // wait

if (typeof module === 'object' && module && module.exports)
	module.exports = wait;
