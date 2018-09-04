// promise-ex

'use strict';

const sleepAsync = (msec, value) =>
	new Promise(resolve => setTimeout(resolve, msec, value));

const result = {};

console.time('promise');
console.log('promise: 0');

sleepAsync(1000, 'A')
.then(val => {
	result.a = val;
	console.log('promise: 1 a:', result.a);
	return sleepAsync(1000, 'B');
})
.then(val => {
	result.b = val;
	console.log('promise: 2 b:', result.b);
	return sleepAsync(1000, 'C');
})
.then(val => {
	result.c = val;
	console.log('promise: 3 c:', result.c);
	console.log('promise: result:', result);
	console.timeEnd('promise');
})
.catch(err => console.error('promise: 9', 'err:', err));
