// promise-from-thunk-ex

var wait = promiseFromThunk(delay);

console.log('start');
wait(1000, 'a1')
.then(val => (console.log(val), wait(1000, 'b2')))
.then(val => (console.log(val), wait(1000, 'c3')))
.then(console.log);

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
