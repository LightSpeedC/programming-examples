// promise-ex

'use strict';

const sleepCall = (msec, value, cb) =>
	setTimeout(cb, msec, value);

console.time('callback');
const result = {};

console.log('callback: 0');

sleepCall(1000, 'A', val => {
	result.a = val;
	console.log('callback: 1 a:', result.a);
	sleepCall(1000, 'B', val => {
		result.b = val;
		console.log('callback: 2 b:', result.b);
		sleepCall(1000, 'C', val => {
			result.c = val;
			console.log('callback: 3 c:', result.c);
			console.log('callback: result:', result);
			console.timeEnd('callback');
		});
	});
});
