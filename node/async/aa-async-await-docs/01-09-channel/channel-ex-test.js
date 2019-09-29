// channel example

'use strict';

const Channel = require('./channel-ex');

const sleepAsync = (msec, value, chan) =>
	(setTimeout(chan = Channel(), msec, null, value), chan);
//	new Promise(resolve => setTimeout(resolve, msec, value));

main().catch(err => console.error(err));

async function main() {
	const result = {};

	console.time('async-await-channel');
	console.log('async-await-channel: 0');
	result.a = await sleepAsync(1000, 'A');
	console.log('async-await-channel: 1 a:', result.a);
	result.b = await sleepAsync(1000, 'B');
	console.log('async-await-channel: 2 b:', result.b);
	result.c = await sleepAsync(1000, 'C');
	console.log('async-await-channel: 3 c:', result.c);
	console.log('async-await-channel: result:', result);
	console.timeEnd('async-await-channel');
}
