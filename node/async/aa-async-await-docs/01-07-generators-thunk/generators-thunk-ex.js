// thunk

'use strict';

console.log('Error.stackTraceLimit:',
	Error.stackTraceLimit, '->', Error.stackTraceLimit = 20);

// aa(main()).catch(err => console.error(err));
aa(main())(err => err && console.error(err));

function *main() {
	const result = {};

	console.time('thunk');
	console.log('thunk: 0');
	// result.a = yield sleepThunk(1000, 'A');
	result.a = yield cb => setTimeout(cb, 1000, null, 'A');
	console.log('thunk: 1 a:', result.a);
	// result.b = yield sleepThunk(1000, 'B');
	result.b = yield cb => setTimeout(cb, 1000, null, 'B');
	console.log('thunk: 2 b:', result.b);
	// result.c = yield sleepThunk(1000, 'C');
	result.c = yield cb => setTimeout(cb, 1000, null, 'C');
	console.log('thunk: 3 c:', result.c);
	console.log('thunk: result:', result);
	console.timeEnd('thunk');
}

function sleepThunk(msec, value) {
	return cb => setTimeout(cb, msec, null, value);
}

// function sleepAsync (msec, value) {
//	return new Promise(resolve => setTimeout(resolve, msec, value));
// }

function aa(gtor) {
	// if (typeof gtor === 'function') gtor = gtor();
	// if (gtor && typeof gtor.then === 'function') return gtor;
	let res = () => {}, rej = () => {};
	setTimeout(next, 0);
	const thunk = cb => (res = val => cb(null, val), rej = cb);
	// thunk.catch = q => q && (rej = q);
	// thunk.then = (p, q) => (p && (res = p), q && (rej = q));
	return thunk;

	function next(err, val) {
		try {
			const obj = err ? gtor.throw(err) : gtor.next(val);
			if (obj.done) return res(obj.value);
			val = obj.value;
			// if (val && typeof val.then === 'function') // promise!
			//	val.then(val => next(null, val), next);
			// else if (val && typeof val === 'function') // thunk!
				val(next);
			// else setTimeout(next, 0, null, val);
		} catch (err) { console.error(err); rej(err); }
	}
}

function filterCallStack(stack) {
	return stack.split('\n').slice(1).filter(x =>
		!x.includes('\(bootstrap_node.js:') &&
		!x.includes('\(timers.js:') &&
		!x.includes('\(module.js:')).join('\n');
}
