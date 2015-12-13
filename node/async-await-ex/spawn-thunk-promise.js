// Callbacks vs Coroutines
// A look ad callbacks vs generators vs coroutines
// https://medium.com/@tjholowaychuk/callbacks-vs-coroutines-174f1fe66127

// co@3 : thunk version

'use strict';

var fs = require('fs');

var test = val => cb => cb(null, val);
//var test = val => cb => cb(val);
var read = fil => cb => fs.readFile(fil, 'utf8', cb);
var wait = sec => cb => setTimeout(cb, sec * 1000);
var xxxx = sec => cb => setTimeout(cb, sec * 1000, new Error('always error'));
var slice = [].slice;
var nextTick = typeof process === 'object' && process && process.nextTick || setImmediate;

var next$i = 0;
var next = (cb, err, val) =>
	++next$i > 50 ? (next$i = 0, nextTick(cb, err, val)) : cb(err, val);

var GeneratorFunction = function *() {}.constructor;
console.log('GeneratorFunction.name ==', GeneratorFunction.name);
Function.prototype.aa$callback = function (cb) { next(this, cb); };
GeneratorFunction.prototype.aa$callback = function (cb) { gencb(this(), cb); };
//var funcb = (fun, cb) => fun.constructor === GeneratorFunction ? gencb(fun(), cb) : next(fun, cb);
var valcb = (val, cb) => next(cb, null, val);
//var valcb = (val, cb) => next(cb, val);
var errcb = (err, cb) => next(cb, err);
var funcb = (fun, cb) => fun.aa$callback(cb);
var anycb = (val, cb) => typecbs[typeof val](val, cb);
//var gencb = (gen, cb) => co3(gen)(cb);
//var objcb = (val, cb) => val ? (ctorcbs[val.constructor.name] ? ctorcbs[val.constructor.name] : valcb)(val, cb) : next(cb, null, val);
var objcb = (val, cb) => val ? ctorcb(val.constructor.name, val, cb) : next(cb, null, val);
var ctorcb = (name, val, cb) => (ctorcbs[name] ? ctorcbs[name] : valcb)(val, cb);
var promisecb = (promise, cb) => promise.then(val => cb(null, val), cb);
var typecbs = {
	'function':  funcb,
	'object':    objcb,
	'number':    valcb,
	'string':    valcb,
	'boolean':   valcb,
	'symbol':    valcb,
	'xml':       valcb,
	'undefined': valcb
};
var ctorcbs = {
	'Object':  (val, cb) =>
		typeof val.next === 'function' && typeof val.throw === 'function' ? gencb(val, cb) :
		typeof val.then === 'function' ? promisecb(val, cb) :
		next(cb, null, val),
	'Array':   (val, cb) => next(cb, null, val),
	'Error':   errcb,
	'Promise': promisecb
};

/*
var fork2 = gen => new Promise((res, rej) =>
	co3(gen)((err, val) => err != null ? rej(err) : res(val)));

var co3 = gen => callback => {
	var cb = function (err, val) {
		try {
			//val = err != null ? gen.throw(err) : gen.next(val);
			val = err != null ? err instanceof Error ? gen.throw(err) :
				gen.next(arguments.length <= 1 ? err : slice.call(arguments)) :
				gen.next(arguments.length <= 2 ? val : slice.call(arguments, 1));
			val.done ? callback(null, val.value) : anycb(val.value, cb);
		} catch (err) { callback(err); }
	}; cb();
};

var co4 = gen => new Promise((res, rej) => {
	var cb = function (err, val) {
		try {
			//val = err != null ? gen.throw(err) : gen.next(val);
			val = err != null ? err instanceof Error ? gen.throw(err) :
				gen.next(arguments.length <= 1 ? err : slice.call(arguments)) :
				gen.next(arguments.length <= 2 ? val : slice.call(arguments, 1));
			val.done ? res(val.value) : anycb(val.value, cb);
		} catch (err) { rej(err); }
	}; cb();
});
*/

var slices0 = [
	args => undefined,
	args => args[0],
	args => [args[0], args[1]],
	args => [args[0], args[1], args[2]],
	args => [args[0], args[1], args[2], args[3]]
];
var slices1 = [
	args => undefined,
	args => undefined,
	args => args[1],
	args => [args[1], args[2]],
	args => [args[1], args[2], args[3]]
];
var slice0 = (args, len) => slices0[len] ? slices0[len](args) : slice.call(args);
var slice1 = (args, len) => slices1[len] ? slices1[len](args) : slice.call(args, 1);

var gencb = (gen, callback) => {
	var cb = function (err, val) {
		try {
			val = err != null ? err instanceof Error ? gen.throw(err) :
				(err = null, val = slice0(arguments, arguments.length)) :
				(err = null, val = slice1(arguments, arguments.length));
			if (!err) {
				if (typeof val === 'object' && val) {
					if (typeof val.next === 'function' &&
						typeof val.throw === 'function')
							return gencb(val, cb);
					else if (typeof val.then === 'function') return promisecb(val, cb);
				}
				else if (typeof val === 'function') return funcb(val, cb);
				val = gen.next(val);
			}
			val.done ? callback(null, val.value) : anycb(val.value, cb);
		} catch (err) { callback(err); }
	}; cb();
};

var fork = gen => {
	var resolve, reject, callback, result;
	var p = new Promise((res, rej) => (resolve = res, reject = rej));
	var thunk = cb => { callback = cb; result && callback.apply(null, result); }
	cb();
	thunk.then = p.then.bind(p);
	thunk['catch'] = p['catch'].bind(p);
	return thunk;

	function cb(err, val) {
		try {
			val = err != null ? err instanceof Error ? gen.throw(err) :
				(err = null, val = slice0(arguments, arguments.length)) :
				(err = null, val = slice1(arguments, arguments.length));
			if (!err) {
				if (typeof val === 'object' && val) {
					if (typeof val.next === 'function' &&
						typeof val.throw === 'function')
							return gencb(val, cb);
					else if (typeof val.then === 'function') return promisecb(val, cb);
				}
				else if (typeof val === 'function') return funcb(val, cb);
				val = gen.next(val);
			}
			val.done ? res(val.value) : anycb(val.value, cb);
		} catch (err) { rej(err); }
	}
	function res(val) {
		result = [null, val];
		try { callback && callback(null, val); }
		catch (err) { return rej(err); }
		resolve(val);
	}
	function rej(err) {
		result = [err];
		try { callback && callback(err); }
		catch (e) { return reject(err), reject(e); }
		reject(err);
	}
	function cb2(err, val) {
		err != null ? err instanceof Error ? cb(err) :
			cb(null, arguments.length <= 1 ? err : [].slice.call(arguments)) :
			cb(null, arguments.length <= 2 ? val : [].slice.call(arguments, 1));
	}
};

function errmsg(e) {
	if (!e) return '';
	var x = (e.stack || e + '').split('\n');
	return '\x1b[31m' + x[0] + ' ' + x[1] + '\x1b[m';
}

fork(function *() {
	//console.log(yield read('README.md'));
	yield wait(0.1);
	//console.log(yield read('package.json'));
	//throw new Error('xxxx');

	try { yield xxxx(0.1); }
	catch (e) { console.error(errmsg(e)); }

	console.log('error caught!');
	console.log('expected: 123   ==', yield cb => cb(null, 123));

	var loops = [5e4, 5e4, 5e4, 5e4, 1e5, 1e5, 1e5, 1e5, 2e5, 1e6, 2e6, 1e7];
	for (var j in loops) {
		//var time = Date.now();
		var x = process.hrtime();
		for (var i = 0, N = loops[j]; i < N; ++i)
			if (i !== (yield test(i)))
			//if (i !== (yield Promise.resolve(i)))
				throw new Error('eh!?');
		var y = process.hrtime();
		var time = x[0] + x[1] / 1e9;
		var delta = y[0] + y[1] / 1e9 - time;
		//var delta = (Date.now() - time) / 1000;
		console.log('%s sec, %s Ktps', delta.toFixed(6), (Math.floor(N / delta) / 1000).toFixed(3), N);
		yield wait(0.1);
	}

	var N = 1e4;
	for (var i = 0; i < N; ++i) if (null      !== (yield null))      throw new Error('eh!?');
	for (var i = 0; i < N; ++i) if (undefined !== (yield undefined)) throw new Error('eh!?');
	for (var i = 0; i < N; ++i) if (1.2       !== (yield 1.2))       throw new Error('eh!?');
	for (var i = 0; i < N; ++i) if ('str'     !== (yield 'str'))     throw new Error('eh!?');
	for (var i = 0; i < N; ++i) if (true      !== (yield true))      throw new Error('eh!?');
	for (var i = 0; i < N; ++i) if (false     !== (yield false))     throw new Error('eh!?');
	for (var i = 0; i < N; ++i) if ((yield {}).constructor !== Object) throw new Error('eh!?');
	for (var i = 0; i < N; ++i) if ((yield []).constructor !== Array)  throw new Error('eh!?');

	console.log('expected: undefined ==', yield undefined);
	console.log('expected: null      ==', yield null);
	console.log('expected: 1.2       ==', yield 1.2);
	console.log('expected: "str"     ==', yield 'str');
	console.log('expected: true      ==', yield true);
	console.log('expected: false     ==', yield false);
	console.log('expected: {}        ==', yield {});
	console.log('expected: []        ==', yield []);
	console.log('expected: Promise 1 ==', yield Promise.resolve(1));

	console.log('GeneratorFunction() start');
	console.log('GeneratorFunction() 123 ==', yield function*() { yield wait(0.1); return 123; }());
	console.log('GeneratorFunction start');
	console.log('GeneratorFunction 123 ==', yield function*() { yield wait(0.1); return 123; });
	console.log('GeneratorFunction() start');
	console.log('GeneratorFunction() 456 ==', yield function*() { yield wait(0.1); return Promise.resolve(456); }());
	console.log('GeneratorFunction start');
	console.log('GeneratorFunction 456 ==', yield function*() { yield wait(0.1); return Promise.resolve(456); });
	console.log('[w, w] start');
	console.log('[w, w] ==', yield [wait(0.1), wait(0.1)]);

	console.log('expected: 123     ==', yield cb => cb(null, 123));
	console.log('expected: [1,2]   ==', yield cb => cb(null, 1, 2));
	console.log('expected: [1,2,3] ==', yield cb => cb(null, 1, 2, 3));
	console.log('expected: [0,123] ==', yield cb => cb(0, 123));
	console.log('expected: ["",12] ==', yield cb => cb('', 12));
	console.log('expected: [1,2]   ==', yield cb => cb(1, 2));
	console.log('expected: [1,2,3] ==', yield cb => cb(1, 2, 3));
	//yield new Error('54321');
	//throw new Error('67890');
	return 12345;
//}()).then(val => console.log('finished:', val), err => console.error('eh!?:', errmsg(err)));
}())((err, val) => console.log('finished: err:', errmsg(err), 'val:', val));
