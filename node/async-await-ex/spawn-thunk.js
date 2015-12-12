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

var fork = gen => new Promise((res, rej, cb) => (cb = (err, val) => {
	try {
		val = err ? gen.throw(err) : gen.next(val);
		val.done ? res(val.value) : val.value(cb);
	} catch (err) { rej(err); }
}, cb()));
var next = typeof process === 'object' && process && process.nextTick || setImmediate;

fork(function *() {
	console.log(yield read('README.md'));
	yield wait(0.1);
	console.log(yield read('package.json'));
	//throw new Error('xxxx');

	try { yield xxxx(0.1); }
	catch (e) { console.error(e.stack || (e + '')); }

	console.log('error caught!');
	console.log('expected: 123 ==', yield cb => cb(null, 123));

	var loops = [1e5, 1e5, 1e5, 2e5, 1e6, 2e6, 1e7];
	for (var j in loops) {
		var time = Date.now();
		for (var i = 0, N = loops[j]; i < N; ++i)
			if (i !== (yield test(i)))
				throw new Error('eh!?');
		var delta = (Date.now() - time) / 1000;
		console.log('%s sec, %s Ktps', delta.toFixed(3), (Math.floor(N / delta) / 1000).toFixed(3));
		yield wait(0.1);
	}

	return 12345;
}()).then(val => console.log('finished:', val), err => console.error('eh!?:', err.stack || err));
