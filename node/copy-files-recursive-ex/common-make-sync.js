function commonMakeSync(Base) {
	'use strict';

	Base.makeSync || (Base.makeSync = makeSync);

	function makeSync(num) {
		if (typeof num !== 'number' || num !== num)
			throw new TypeError('number of parallel must be a number');

		if (num <= 0)
			throw new RangeError('number of parallel must be a positive number');

		var resolves = [];

		return function sync(val) {
			return Base(function (res, rej) {
				resolves.push({res: res, val: val});
				if (resolves.length >= num)
					resolves.forEach(elem => (elem.res)(elem.val));
			});
		} // sync
	} // makeSync

	return Base;
};

if (typeof module === 'object' && module && module.exports)
	module.exports = commonMakeSync;
