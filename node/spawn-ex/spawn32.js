void function () {
	'use strict';

	module.exports = spawn;

	var spawn3 = require('./spawn3');

	function spawn(val) {
		var resolve, reject;
		var p = new Promise(function (res, rej) {
			resolve = res; reject = rej;
		});
		var thunk = spawn3(val);
		thunk.then = function (res, rej) {
			thunk(function (err, val) {
				err ? reject(err) : resolve(val);
			});
			return p.then(res, rej);
		};
		thunk['catch'] = function (rej) {
			return thunk.then(null, rej);
		};
		return thunk;
	} // spawn

} ();
