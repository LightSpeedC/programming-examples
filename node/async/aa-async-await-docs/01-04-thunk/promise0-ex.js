// promise

'use strict';

// const sleepThunk = (msec, value) =>
//	new Thunk((resolve, reject) => value < 0 ?
//		setTimeout(reject, 0, new Error('sleepAsync: ' + value)) :
//		setTimeout(resolve, msec, value));
// const sleepThunk = (msec, value) => (cb => value < 0 ?
//		setTimeout(cb, 0, new Error('sleepThunk: ' + value)) :
//		setTimeout(cb, msec, null, value));
// const sleepThunk = (msec, value) =>
//		cb => setTimeout(cb, msec, null, value);
// const sleepAsync = (msec, value) =>
//		new Promise((resolve, reject) => value < 0 ?
//			setTimeout(reject, 0, new Error('sleepAsync: ' + value)) :
//			setTimeout(resolve, msec, value));
// const sleepAsync = (msec, value) =>
//		new Promise(resolve => setTimeout(resolve, msec, value));

// thunk to promise
// const th2p = thunk => ({then: (res, rej) =>
//	thunk((err, val) => err ? rej ? rej(err) : err : res ? res(val) : val)});
//	new Promise((res, rej) => th((err, val) => err ? rej(err) : res(val)));

main().catch(err => console.error(err));

async function main() {
	const result = {};

	console.time('promise0');
	console.log('promise0: 0');
	result.a = await sleepAsync(1000, 'A');
	console.log('promise0: 1 a:', result.a);
	result.b = await sleepAsync(1000, 'B');
	console.log('promise0: 2 b:', result.b);
	result.c = await sleepAsync(1000, 'C');
	console.log('promise0: 3 c:', result.c);
	console.log('promise0: result:', result);
	console.timeEnd('promise0');
	//await sleepAsync(-1, 'Z'));
	await sleepAsync(-1, 'Z');
	console.log('promise0: end');
}
