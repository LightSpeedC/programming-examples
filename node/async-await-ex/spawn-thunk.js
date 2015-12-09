// Callbacks vs Coroutines
// A look ad callbacks vs generators vs coroutines
// https://medium.com/@tjholowaychuk/callbacks-vs-coroutines-174f1fe66127

// co@3 : thunk version

'use strict';

var fs = require('fs');

var test = val => cb => next(cb, null, val);
var read = fil => cb => fs.readFile(fil, 'utf8', cb);
var wait = sec => cb => setTimeout(cb, sec * 1000);
var xxxx = sec => cb => setTimeout(cb, sec * 1000, new Error('always error'));

var fork = gen => new Promise((res, rej, cb) => (cb = (err, val) => (val = err ? gen.throw(err) : gen.next(val), val.done ? res(val.value) : val.value(cb)), cb()));
var next = typeof process === 'object' && process && process.nextTick || setImmediate;

fork(function *() {
	console.log(yield read('README.md'));
	yield wait(1);
	console.log(yield read('package.json'));

	try { yield xxxx(1); }
	catch (e) { console.error(e.stack || (e + '')); }

	console.log('error caught!');
	console.log('expected: 123 ==', yield cb => cb(null, 123));

	var time = Date.now();
	for (var i = 0; i < 1e5; ++i) if (i !== (yield test(i))) throw new Error('eh!?');
	console.log('%s msec', Date.now() - time);

	yield wait(1);

	var time = Date.now();
	for (var i = 0; i < 1e5; ++i) if (i !== (yield test(i))) throw new Error('eh!?');
	console.log('%s msec', Date.now() - time);

	return 12345;
}()).then(val => console.log('finished:', val));
