function commonMethods(Base) {
	'use strict';

	Base.resolve || (Base.resolve = resolve);
	Base.reject || (Base.reject = reject);
	Base.wait || (Base.wait = wait);

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

	return Base;
};

if (typeof module === 'object' && module && module.exports)
	module.exports = commonMethods;
