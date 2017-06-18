'usr strict';

var slice = [].slice;

require('./common-methods')
	(require('./common-aa')
		(Thunk));

module.exports = Thunk;

// var backgroundTasks = [];

function Thunk(setup, cb) {
	if (typeof setup !== 'function')
		throw new TypeError('first argument "setup" must be a function');

	// callback mode
	if (typeof cb === 'function') {
		// cb = normalizeCallback(cb);
		try { return setup(cb, cb), undefined; }
		catch (err) { return cb(err), undefined; } // TODO nextTick
	}

	// promise & thunk mode

	var called = false, bombs = [], results;

	var callback = normalizeCallback(function callback(err, val) {
		if (!results) results = arguments;
		return fire();
	});

	// pre-setup
	if (cb === true)
		try { called = true, setup(callback, callback); }
		catch (err) { callback(err); }

	var thunk = function thunk(cb) {
		// cb = normalizeCallback(cb);
		var next, thunk = Thunk(function (cb) { next = cb; }, true);

		try {
			if (!called) called = true, setup(callback, callback);
		} catch (err) { next(err); }

		bombs.push(function (err, val) {
			try { return next(cb(err, val)); }
			catch (err) { return next(err); }
		});

		if (results) fire(); // TODO nextTick

		return thunk;
	}

	thunk.then = makeThen(thunk);
	thunk['catch'] = makeCatch(thunk);
	return thunk;

	function fire() {
		if (!results) return;
		var bomb, val;
		while (bomb = bombs.shift())
			val = bomb.apply(undefined, results);
		return val;
	}
}

function makeThen(thunk) {
	return function then(res, rej) {
		return thunk(function (err, val) {
			return err ?
				typeof rej === 'function' ? rej(err) : err :
				typeof res === 'function' ? res(val) : val;
		});
	};
}

function makeCatch(thunk) {
	return function (rej) {
		return thunk(function (err, val) {
			return err ?
				typeof rej === 'function' ? rej(err) : err :
				val;
		});
	};
}

function normalizeCallback(cb) {
	return function next(err, val) {
		if (arguments.length > 2)
			val = slice.call(arguments, 1);
		else if (arguments.length === 1 && !(err instanceof Error))
			val = err, err = null;

		if (err || !val) return cb(err, val);
		else if (typeof val === 'function') val(next);
		else if (typeof val.then === 'function') val.then(next, next);
		else return cb(err, val);
	};
}

if (require.main === module)
	require('./common-bench')(Thunk).bench('Thunk');
