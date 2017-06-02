var slice = [].slice;

require('./common-methods')(Thunk);
require('./common-aa')(Thunk);

// var backgroundTasks = [];

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
		try { return setup(last, last); }
		catch (err) { return cb(err); }
	}

	// promise & thunk mode

	var called = false, bombs = [], results;

	var callback = function callback(err, val) {
		if (!results)
			results = arguments.length > 2 ? [err, slice.call(arguments, 1)] :
				arguments.length === 1 && !(err instanceof Error) ? [null, err] :
					arguments;
		fire();
	}

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

		if (results) fire();

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

require('./common-bench')(Thunk);
Thunk.bench('Thunk');
