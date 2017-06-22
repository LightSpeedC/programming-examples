var ThunkCore = function (nextTick) {
	'use strict';

	var slice = [].slice;

	return Thunk;

	function Thunk(setup, cb) {
		if (typeof setup !== 'function')
			throw new TypeError('first argument "setup" must be a function');

		// callback mode
		if (typeof cb === 'function') {
			var last = function (err, val) {
				var args = arguments.length > 2 ? [err, slice.call(arguments, 1)] :
					arguments.length === 1 && !(err instanceof Error) ? [null, err] :
						arguments;
				cb.apply(null, args);
			};
			try { setup(last, last); return; }
			catch (err) { cb(err); return; }
		}

		// promise & thunk mode

		var called = false, bombs = [], results;

		var callback = function callback(err, val) {
			if (!results)
				results = arguments.length > 2 ? [err, slice.call(arguments, 1)] :
					arguments.length === 1 && !(err instanceof Error) ? [null, err] :
						arguments;
			nextTick(fire);
		}; // callback

		// pre-setup
		if (cb === true)
			try { called = true, setup(callback, callback); }
			catch (err) { callback(err); }

		var thunk = function thunk(cb) {
			var next, thunk = Thunk(function (cb) { next = cb; }, true);

			try {
				if (!called) called = true, setup(callback, callback);
			} catch (err) { next(err); }

			bombs.push(function (err, val) {
				try {
					var r = cb.apply(null, arguments);
					next(null, r);
				}
				catch (err) { next(err); }
			});

			if (results) nextTick(fire);

			return thunk;
		}; // thunk

		thunk.then = function then(res, rej) {
			return thunk(function (err, val) {
				return err ?
					typeof rej === 'function' ? rej(err) : err :
					typeof res === 'function' ? res(val) : val;
			});
		}; // then

		thunk['catch'] = function (rej) {
			return thunk(function (err, val) {
				return err ?
					typeof rej === 'function' ? rej(err) : err :
					val;
			});
		}; // catch

		return thunk;

		function fire() {
			if (!results) return;
			var bomb;
			while (bomb = bombs.shift())
				bomb.apply(null, results);
		} // fire

	} // Thunk

}(typeof nextTickBackgroundTasks === 'function' ?
	nextTickBackgroundTasks : require('./next-tick-background-tasks'));

if (typeof module === 'object' && module && module.exports)
	module.exports = ThunkCore;
