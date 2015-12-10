// Callbacks vs Coroutines
// A look ad callbacks vs generators vs coroutines
// https://medium.com/@tjholowaychuk/callbacks-vs-coroutines-174f1fe66127

// co@4 : Promise version

'use strict';

//var Promise = require('promise-light');
//var Promise = require('bluebird');
var fs = require('fs');

var test = val => Promise.resolve(val);
var read = fil => new Promise((res, rej) => fs.readFile(fil, 'utf8', (err, val) => err ? rej(err) : res(val)));
var wait = sec => new Promise((res, rej) => setTimeout(res, sec * 1000));
var xxxx = sec => new Promise((res, rej) => setTimeout(rej, sec * 1000, new Error('always error')));

var fork = gen => new Promise((res, rej, cb) => (cb = (err, val) => {
	val = err ? gen.throw(err) : gen.next(val),
	val.done ? res(val.value) : val.value.then(val => cb(null, val), cb)
}, cb()));

fork(function *() {
	console.log(yield read('README.md'));
	yield wait(0.1);
	console.log(yield read('package.json'));

	try { yield xxxx(0.1); } 
	catch (e) { console.log(e.stack || (e + '')); }

	console.log('error caught!');
	console.log('expected: 123 ==', yield Promise.resolve(123));

	var loops = [1e5, 1e5, 1e5, 2e5, 1e6, 2e6, 1e7];
	for (var j in loops) {
		var time = Date.now();
		for (var i = 0, N = loops[j]; i < N; ++i)
			if (i !== (yield test(i)))
				throw new Error('eh!?');
		var delta = (Date.now() - time) / 1000;
		console.log('%s sec, %s tps', delta.toFixed(3), N / delta);
		yield wait(0.1);
	}

	return 12345;
}()).then(val => console.log('finished:', val), err => console.error('eh!?:', err.stack || err));
