// promise-with-thunk-ex

function sleep(ms, val, cb) {
	setTimeout(cb, ms, null, val);
}

var wait = promiseFromThunk(delay);

console.log('start');
wait(1000, 'a1')
.then(val => (console.log(val), wait(1000, 'b2')))
.then(val => (console.log(val), wait(1000, 'c3')))

function thunkify(fn) {
	return function () {
		var ctx = this, args = arguments, cb, result;
		args[args.length++] = function (err, val) {
			result = arguments;
			if (cb) cb.apply(ctx, result);
		};
		fn.apply(ctx, args);
		return function (callback) {
			cb = callback;
			if (result) cb.apply(ctx, result);
		};
	};
}

function delay(ms, val) {
	return function (cb) {
		setTimeout(cb, ms, null, val);
	};
}

function promiseFromThunk(thunk) {
	return function () {
		var args = arguments, ctx = this;
		return new Promise(function (res, rej) {
			thunk.apply(ctx, args)(function (err, val) {
				if (err) rej(err);
				else res(val);
			});
		});
	};
}
