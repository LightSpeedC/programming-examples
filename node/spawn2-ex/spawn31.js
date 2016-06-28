void function () {
	'use strict';

	module.exports = spawn;

	var spawn3 = require('./spawn3');

	function spawn(gfn) {
		var callback;
		var p = new Promise(function (resolve, reject) {
			spawn3(gfn)(function (err, val) {
				callback && callback(err, val);
				err ? reject(err) : resolve(val);
			});
		});
		function thunk(cb) { callback = cb; }
		thunk.then = function (res, rej) { p.then(res, rej); };
		thunk['catch'] = function (rej) { p['catch'](rej); };
		return thunk;
	} // spawn

} ();
