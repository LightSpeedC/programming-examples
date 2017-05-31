var slice = [].slice;

// var backgroundTasks = [];

function Thunk(setup, cb) {
	if (typeof setup !== 'function')
		throw new TypeError('first argument "setup" must be a function');

	// callback mode
	if (typeof cb === 'function') return setup(cb);

	// promise & thunk mode

	var called = false, bombs = [], results;

	function callback(err, val) {
		if (!results)
			results = arguments.length > 2 ? [err, slice.call(arguments, 1)] :
				arguments.length === 1 && !(err instanceof Error) ? [null, err] :
				arguments;
		fire();
	}

	// pre-setup
	if (cb === true) called = true, setup(callback);

	function thunk(cb) {
		if (!called) called = true, setup(callback);

		var next, thunk = Thunk(function (cb) { next = cb; }, true);

		bombs.push(function (err, val) {
			try { next(null, cb.apply(null, arguments)); }
			catch (err) { next(err); }
		});

		if (results) fire();

		return thunk;
	}

	thunk.then = function then(res, rej) {
		return thunk(function (err, val) {
			return err ? rej(err) : res(val);
		});
	};

	thunk['catch'] = function (rej) {
		return thunk(function (err, val) {
			return err ? rej(err) : val;
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

function aa(gtor, cb) {
	return Thunk(function (cb) {
		next();
		function next(err, val) {
			if (arguments.length > 2)
				val = slice.call(arguments, 1);
			if (arguments.length === 1 && !(err instanceof Error))
				val = err, err = null;
			try { var obj = err ? gtor.throw(err) : gtor.next(val); }
			catch (err) { cb(err); }
			if (obj.done) return cb(null, value);
			val = obj.value;
			if (typeof val === 'function') return val(next);
			if (typeof val === 'object' && val !== null &&
				typeof val.then === 'function') return val.then(next, next);
			next(null, val);
		}
	}, cb);
}

Thunk(function (cb) {
	setTimeout(function () { console.log('1a:OK?'); cb(null, '1b:OK!'); }, 1000);
}, function (err, val) { return console.log('1c:end:', err, val), '1d:end'; });

Thunk(function (cb) {
	setTimeout(function () { console.log('2a:OK?'); cb(null, '2b:OK!'); }, 1000);
})
(function (err, val) { return console.log('2c:end:', err, val), '2d:end'; })
(function (err, val) { return console.log('2e:end:', err, val), '2f:end'; });

Thunk(function (cb) {
	setTimeout(function () { console.log('3a:OK?'); cb(null, '3b:OK!'); }, 1000);
})
.then(function (val) { return console.log('3c:val:', val), '3d:end'; })
.then(function (val) { return console.log('3g:val:', val), '3h:end'; })
.catch(function (err) { return console.log('3e:err:', err), '3f:end'; });
