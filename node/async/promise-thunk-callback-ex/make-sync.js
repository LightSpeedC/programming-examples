function makeSync(num) {
	'use strict';

	var Base = this;

	if (typeof num !== 'number' || num !== num)
		throw new TypeError('number of parallel must be a number');

	if (num <= 0)
		throw new RangeError('number of parallel must be a positive number');

	var resolves = [];

	return function sync(val) {
		return new Base(function (res, rej) {
			resolves.push({res: res, val: val});
			if (resolves.length >= num)
				resolves.forEach(elem => (elem.res)(elem.val));
		});
	} // sync
} // makeSync

if (typeof module === 'object' && module && module.exports)
	module.exports = makeSync;
