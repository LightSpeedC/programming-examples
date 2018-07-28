// Memory Leak? native Promise and complex arrow functions with Generators
// node version: v0.12.9, v4.2.3, v5.1.1, v5.2.0 (x86, x64)
// I tried Windows version. OS: Windows 10 (64bit), Windows 8.1 (64bit).

'use strict';

//var Promise = require('promise-light'); // better Promise implementation
//var Promise = require('bluebird');      //  best  Promise implementation

var test = val => Promise.resolve(val);
var wait = sec => new Promise((res, rej) => setTimeout(res, sec * 1000));
var fork = gen => new Promise((res, rej, cb) => (
	cb = (err, val) => (
		(val = err ? gen.throw(err) : gen.next(val)),
		(val.done ? res(val.value) : val.value.then(val => cb(null, val), cb))
	), cb()
));
var forkSolved = gen => new Promise((res, rej) => {
	var cb = (err, val) => {
		try { val = err ? gen.throw(err) : gen.next(val); } catch (e) { rej(e); }
		val.done ? res(val.value) : val.value.then(val => cb(null, val), cb);
	}; cb();
});
// var fork = require('co');
// var fork = require('aa');

fork(function *() {
	console.log('start!');
	yield wait(0.1);
	console.log('expected: 123 ==', yield Promise.resolve(123));

	var loops = [1e5, 2e5, 1e6, 2e6, 1e7];
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
