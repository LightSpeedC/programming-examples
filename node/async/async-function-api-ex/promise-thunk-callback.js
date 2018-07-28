// promise-thunk-callback

(this || {}).promiseThunkCallback = function () {
	'use strict';

	if (typeof module === 'object' && module && module.exports)
		module.exports = promiseThunkCallback;

	function promiseThunkCallback() {
		var promise, resolve, reject, pending = true;
		var ctx, results, cbs = [];

		function setup(res, rej) { resolve = res; reject = rej; }

		function thunk(cb) {
			if (typeof cb === 'function')
				cbs.push(cb);
			if (results !== undefined)
				callback.apply(ctx, results);
		}

		thunk.then = function then(res, rej) {
			if (promise === undefined)
				promise = new Promise(setup);
			if (results !== undefined)
				callback.apply(ctx, results);
			return promise.then(res, rej);
		};

		thunk['catch'] = function caught(rej) {
			if (promise === undefined)
				promise = new Promise(setup);
			if (results !== undefined)
				callback.apply(ctx, results);
			return promise['catch'](rej)
		};

		function callback(err, val) {
			if (results === undefined)
				ctx = this, results = arguments;

			cbs.forEach(function (cb) { cb.apply(ctx, results); });
			cbs = [];

			if (pending && promise !== undefined) {
				if (results[0]) reject(results[0]);
				else resolve(results[1]);
				pending = false;
			}
		}

		callback.promiseThunk = thunk;
		return callback;
	}

} ();
