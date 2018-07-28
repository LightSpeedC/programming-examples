// promise-with-thunk-ex

function sleep(ms, val, cb) {
	setTimeout(cb, ms, null, val);
}

//var wait = promiseFromThunk(delay);
var wait = promisify(sleep);

console.log('start');
wait(1000, 'a1')
.then(val => (console.log(val), wait(1000, 'b1')))
.then(val => (console.log(val), wait(1000, 'c1')))
.then(console.log);

var x = wait(4000, 'a2')
(function (err, val) { console.log(val); return wait(1000, 'b2'); })
(function (err, val) { console.log(val); return wait(1000, 'c2'); })
console.log(typeof x, x && x.constructor.name);

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
			return 222;
		};
	};
}

function promisify(fn) {
	return function () {
		var ctx = this, args = arguments, cb, result, resolve, reject;
		args[args.length++] = function (err, val) {
			result = arguments;
			if (cb) cb.apply(ctx, result);
			if (err) reject(err);
			else resolve(val);
		};
		fn.apply(ctx, args);
		var p = new Promise(function (res, rej) {
			resolve = res; reject = rej;
		});
		thunk.then = p.then.bind(p);
		thunk['catch'] = p['catch'].bind(p);
		return thunk;
		function thunk(callback) {
			cb = function () {
				var r = callback.apply(this, arguments);
				console.log(444, 'r', typeof r, r && r.constructor.name);
				console.log(555, 'then', r && typeof r.then);
				//if (r && typeof r.then === 'function') return r.then(console.log, console.log);
				if (typeof r === 'function') return r(console.log);
				//if (r && typeof r.then === 'function')
				//	r.then
				return r;
			};
			if (result) cb.apply(ctx, result);
			return thunk;
		}
	};
}

function delay(ms, val) {
	return cb => setTimeout(cb, ms, null, val);
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
