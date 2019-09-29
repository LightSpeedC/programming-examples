// thunk

'use strict';

const sleepThunk = (msec, value) =>
	cb => setTimeout(cb, msec, null, value);

const result = {};

console.time('thunk');
console.log('thunk: 0');

sleepThunk(1000, 'A')
((err, val) => {
	result.a = val;
	console.log('thunk: 1 a:', result.a);
	sleepThunk(1000, 'B')
	((err, val) => {
		result.b = val;
		console.log('thunk: 2 b:', result.b);
		sleepThunk(1000, 'C')
		((err, val) => {
			result.c = val;
			console.log('thunk: 3 c:', result.c);
			console.log('thunk: result:', result);
			console.timeEnd('thunk');
		});
	});
});
