// async await

'use strict';

const sleepAsync = (msec, value) =>
	new Promise(resolve => setTimeout(resolve, msec, value));

main();

async function main() {
	const result = {};

	console.time('async-await');
	console.log('async-await: 0');
	result.a = await sleepAsync(1000, 'A');
	console.log('async-await: 1 a:', result.a);
	result.b = await sleepAsync(1000, 'B');
	console.log('async-await: 2 b:', result.b);
	result.c = await sleepAsync(1000, 'C');
	console.log('async-await: 3 c:', result.c);
	console.log('async-await: result:', result);
	console.timeEnd('async-await');
}
