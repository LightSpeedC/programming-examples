// thunk

'use strict';

function Thunk(setup) {
	const cbs = [];
	let result = null;

	try { setup(resolve, reject);
	} catch (err) { result = [err]; }

	thunk.then = (res, rej) => {
		let a, b;
		const p = new Thunk((c, d) => (a = c, b = d));
		thunk((err, val) => err ?
			b(rej ? rej(err) : err) :
			a(res ? res(val) : val));
		return p;
	};
	thunk.catch = rej => thunk.then(undefined, rej);

	return thunk;

	function thunk(cb) {
		cbs.push(cb);
		done();
	}

	function done() {
		while (result !== null && cbs.length > 0)
			cbs.shift().apply(null, result);
	}

	function resolve(err, val) {
		if (result === null) {
			if (arguments.length === 1 && !(err instanceof Error))
				result = [null, err];
			else
				result = arguments;
		}
		setTimeout(done, 0);
	}

	function reject(err, val) {
		if (result === null) result = arguments;
		setTimeout(done, 0);
	}
}

const sleepThunk = (msec, value) =>
	new Thunk((resolve, reject) => value < 0 ?
		setTimeout(reject, 0, new Error('sleepAsync: ' + value)) :
		setTimeout(resolve, msec, value));
// const sleepThunk = (msec, value) => (cb => value < 0 ?
//		setTimeout(cb, 0, new Error('sleepThunk: ' + value)) :
//		setTimeout(cb, msec, null, value));
// const sleepThunk = (msec, value) =>
//   cb => setTimeout(cb, msec, null, value);
// const sleepAsync = (msec, value) =>
//   new Promise((resolve, reject) => value < 0 ?
//     setTimeout(reject, 0, new Error('sleepAsync: ' + value)) :
//     setTimeout(resolve, msec, value));
// const sleepAsync = (msec, value) =>
//   new Promise(resolve => setTimeout(resolve, msec, value));

// thunk to promise
const th2p = thunk => ({then: (res, rej) =>
	thunk((err, val) => err ? rej ? rej(err) : err : res ? res(val) : val)});
//	new Promise((res, rej) => th((err, val) => err ? rej(err) : res(val)));

main().catch(err => console.error(err));

async function main() {
	const result = {};

	console.time('thunk');
	console.log('thunk: 0');
	result.a = await th2p(sleepThunk(1000, 'A'));
	console.log('thunk: 1 a:', result.a);
	result.b = await th2p(sleepThunk(1000, 'B'));
	console.log('thunk: 2 b:', result.b);
	result.c = await th2p(sleepThunk(1000, 'C'));
	console.log('thunk: 3 c:', result.c);
	console.log('thunk: result:', result);
	console.timeEnd('thunk');
	//await th2p(sleepThunk(-1, 'Z'));
	await sleepThunk(-1, 'Z');
	console.log('thunk: end');
}
