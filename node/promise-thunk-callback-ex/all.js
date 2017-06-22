function all(arg, cb) {
	'use strict';

	if (arg == null ||
		(arg.constructor !== Array &&
		 arg.constructor !== Object))
		throw new TypeError('first argument is not an array or an object');

	return arg.constructor === Array ?
		allArray.apply(this, arguments) :
		allObject.apply(this, arguments);
} // all

function allArray(arr, cb) {
	'use strict';

	//if (arr == null || arr.constructor !== Array)
	//	throw new TypeError('first argument is not an array');

	return new this(function (res, rej) {
		var n = arr.length;
		if (n === 0) { res([]); return; }

		var result = new Array(n);
		arr.forEach((p, i) => p.then(val => {
			result[i] = val;
			--n || res(result);
		}, rej));
	}, cb);
} // allArray

function allObject(obj, cb) {
	'use strict';

	//if (obj == null || obj.constructor !== Object)
	//	throw new TypeError('first argument is not an object');

	return new this(function (res, rej) {
		var keys = Object.keys(obj);
		var n = keys.length;
		if (n === 0) { res({}); return; }

		var result = keys.reduce((that, prop) => (that[prop] = undefined, that), {});
		keys.forEach(prop => obj[prop].then(val => {
			result[prop] = val;
			--n || res(result);
		}, rej));
	}, cb);
} // allObject

if (typeof module === 'object' && module && module.exports)
	module.exports = all;
