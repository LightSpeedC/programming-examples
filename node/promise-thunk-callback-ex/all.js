function commonMethods(Base) {
	'use strict';

	Base.resolve || (Base.resolve = resolve);
	Base.reject || (Base.reject = reject);
	Base.wait || (Base.wait = wait);
	Base.all || (Base.all = all);

	function resolve(val) {
		return Base(function (res, rej) {
			res(val);
		}, true);
	} // resolve

	function reject(err) {
		return Base(function (res, rej) {
			rej(err);
		}, true);
	} // reject

	function wait(msec, val) {
		return Base(function (res, rej) {
			setTimeout(res, msec, val);
		});
	} // wait

	function all(arg, cb) {
		if (arg == null ||
			(arg.constructor !== Array && arg.constructor !== Object))
			throw new TypeError('first argument is not an array or an object');

		return arg.constructor === Array ? allArray(arg, cb) : allObject(arg, cb);
	} // all

	function allArray(arr, cb) {
		//if (arr == null || arr.constructor !== Array)
		//	throw new TypeError('first argument is not an array');

		return Base(function (res, rej) {
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
		//if (obj == null || obj.constructor !== Object)
		//	throw new TypeError('first argument is not an object');

		return Base(function (res, rej) {
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

	return Base;
};

if (typeof module === 'object' && module && module.exports)
	module.exports = commonMethods;
