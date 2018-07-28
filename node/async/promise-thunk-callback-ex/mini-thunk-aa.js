function miniThunkAa() {

	'use strict';

	var slice = [].slice;

	var nextTick = typeof nextTickBackgroundTasks === 'function' ?
		nextTickBackgroundTasks : require('./next-tick-background-tasks');

	// function normalizeCallback(cb) {
	// 	return function (err, val) {
	// 		if (arguments.length > 2)
	// 			val = slice.call(arguments, 1);
	// 		else if (arguments.length === 1 && !(err instanceof Error))
	// 			val = err, err = null;
	// 		return cb(err, val);
	// 	}
	// }

	function Thunk(setup, opts) {
		if (typeof setup !== 'function')
			throw new TypeError('first argument "setup" must be a function');

		// promise & thunk mode

		var called = false, bombs = [], results;

		function callback(err, val) {
			if (!results) {
				if (arguments.length > 2)
					val = slice.call(arguments, 1);
				else if (arguments.length === 1 && !(err instanceof Error))
					val = err, err = null;
				results = [err, val];
			}
			nextTick(fire);
		}

		if (opts === true) called = true, setup(callback, callback);

		function thunk(cb) {
			var next, thunk = Thunk(function (cb) { next = cb; }, true);

			try { if (!called) called = true, setup(callback, callback); }
			catch (err) { next(err); }

			bombs.push(function (err, val) {
				try { next(null, cb(err, val)); }
				catch (err) { next(err); }
			});

			if (results) nextTick(fire);
			return thunk;
		}

		thunk.then = function then(res, rej) {
			return thunk(function (err, val) {
				return err ?
					typeof rej === 'function' ? rej(err) : err :
					typeof res === 'function' ? res(val) : val;
			});
		};

		thunk['catch'] = function (rej) {
			return thunk(function (err, val) {
				return err ?
					typeof rej === 'function' ? rej(err) : err :
					val;
			});
		};

		return thunk;

		function fire() {
			if (!results) return;
			var bomb;
			while (bomb = bombs.shift())
				bomb.apply(null, results);
		}
	}

	Thunk.aa = aa;

	function aa(gtor) {
		if (typeof gtor === 'function') gtor = gtor();
		return Thunk(function (res, rej) {
			next();
			function next(err, val) {
				if (arguments.length > 2)
					val = slice.call(arguments, 1);
				else if (arguments.length === 1 && !(err instanceof Error))
					val = err, err = null;
				try { var obj = err ? gtor.throw(err) : gtor.next(val); }
				catch (err) { rej(err); }
				val = obj.value;
				if (obj.done) res(val);
				else if (!val) next(null, val);
				else if (val instanceof Error) next(val);
				else if (typeof val === 'function') val(next);
				else if (typeof val.then === 'function') val.then(next, next);
				else next(null, val);
			} // next
		});
	} // aa

	(typeof commonBench === 'function' ? commonBench : require('./common-bench'))(Thunk)
		.bench('MiniThunkAa');
}

miniThunkAa();
