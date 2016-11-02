// sleep([opts,] msec, [val], [cb])

'use strict';

function sleep(opts, msec, val, cb) {
	var i = 0, a = arguments, n = arguments.length;
	cb = typeof a[n - 1] === 'function' ? a[--n] : promiseThunkCallback();
	opts = i < n && typeof a[i] === 'object' && a[i++] || {};
	msec = i < n ? a[i++] : undefined;
	val  = i < n ? a[i++] : undefined;

	if (!(msec >= 0)) throw new TypeError('number msec must specify');

	setTimeout(cb, msec, null, val);
	return cb.thunk;
}

// promise-thunk-callback
function promiseThunkCallback() {
	var p, resolve, reject, solved, ctx, results, cbs = [];

	function setup(res, rej) {
		resolve = res; reject = rej;
	}

	function thunk(cb) {
		//if (cb) {
		//	var x = promiseThunkCallback();
		//	x.cb = cb;
		//	cbs.push(x);
		//}
		if (cb) cbs.push(cb);
		results && callback.apply(ctx, results);
		//return x && x.thunk;
	}

	thunk.then = function then(res, rej) {
		if (!p) p = new Promise(setup);
		var q = p.then(res, rej);
		results && callback.apply(ctx, results);
		return q;
	};

	thunk['catch'] = function caught(rej) {
		if (!p) p = new Promise(setup);
		var q = p['catch'](rej)
		results && callback.apply(ctx, results);
		return q;
	};

	function callback(err, val) {
		if (!results)
			ctx = this, results = arguments;

		//cbs.forEach(function (x) {
		//	try {
		//		var v = x.cb.apply(ctx, results);
		//		if (typeof v === 'function') v(x);
		//		else if (v && v.then) v.then(function (v) { return x(null, v);}, x);
		//		else x(null, v);
		//	} catch (e) {
		//		x(e);
		//	}
		//});
		cbs.forEach(function (cb) {
			cb.apply(ctx, results);
		});
		cbs = [];

		if (!solved && p) {
			if (results[0]) reject(results[0]);
			else resolve(results[1]);
			solved = true;
		}
	}

	callback.thunk = thunk;
	return callback;
}

var delay = sleep;
var wait = sleep;

sleep(1000, 'cb',
	(err, val) => console.log('sleep1', err, val));
delay(1000, 'thunk')
	((err, val) => console.log('delay1', err, val));
wait(1000, 'promise')
	.then(val => console.log('wait-1', val),
		err => console.log('wait1e', err));
wait(1500, 'promise')
	.then(val => console.log('wait15', val))
	.catch(err => console.log('wait15e', err));
sleep(1600, () => console.log());

sleep(2000,
	(err, val) => console.log('sleep2', err, val));
delay(2000)
	((err, val) => console.log('delay2', err, val));
wait(2000)
	.then(val => console.log('wait-2', val),
		err => console.log('wait2e', err));
wait(2500)
	.then(val => console.log('wait25', val))
	.catch(err => console.log('wait25e', err));
sleep(2600, () => console.log());

sleep({}, 3000,
	(err, val) => console.log('sleep3', err, val));
delay({}, 3000)
	((err, val) => console.log('delay3', err, val));
wait({}, 3000)
	.then(val => console.log('wait-3', val),
		err => console.log('wait3e', err));
wait({}, 3500)
	.then(val => console.log('wait35', val))
	.catch(err => console.log('wait35e', err));
sleep(3600, () => console.log());

//delay({}, 4000)
//	((err, val) => (console.log('delay4', err, val), delay({}, 500)))
//	((err, val) => console.log('delay5', err, val))
//	.then(val => console.log('wait65', val))
//	.catch(err => console.log('wait65e', err));
