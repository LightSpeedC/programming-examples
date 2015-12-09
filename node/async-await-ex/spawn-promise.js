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

var fork = gen => new Promise((res, rej, cb) => (cb = (err, val) => (val = err ? gen.throw(err) : gen.next(val), val.done ? res(val.value) : val.value.then(val => cb(null, val), cb)), cb()));

fork(function *() {
	console.log(yield read('README.md'));
	yield wait(1);
	console.log(yield read('package.json'));

	try { yield xxxx(1); } 
	catch (e) { console.log(e.stack || (e + '')); }

	console.log('error caught!');
	console.log('expected: 123 ==', yield Promise.resolve(123));

	var time = Date.now();
	for (var i = 0; i < 1e5; ++i) if (i !== (yield test(i))) throw new Error('eh!?');
	console.log('%s msec', Date.now() - time);

	yield wait(1);

	var time = Date.now();
	for (var i = 0; i < 1e5; ++i) if (i !== (yield test(i))) throw new Error('eh!?');
	console.log('%s msec', Date.now() - time);

	return 12345;
}()).then(val => console.log('finished:', val));
