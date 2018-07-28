void function () {
	'use strict';

	module.exports = spawn;

	var spawn3 = require('./spawn3');

	function spawn(val) {
		var callback;
		var p = new Promise(function (resolve, reject) {
			spawn3(val)(function (err, val) {
				callback && callback(err, val);
				err ? reject(err) : resolve(val);
			});
		});
		function thunk(cb) { callback = cb; }
		thunk.then = function (res, rej) { return p.then(res, rej); };
		thunk['catch'] = function (rej) { return p['catch'](rej); };
		return thunk;
	} // spawn

} ();
