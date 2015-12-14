// Callbacks vs Coroutines
// A look ad callbacks vs generators vs coroutines
// https://medium.com/@tjholowaychuk/callbacks-vs-coroutines-174f1fe66127

// co@3 : thunk version
// co@4 : Promise version

'use strict';

var fs = require('fs');

var test = val => cb => cb(null, val);
var read = fil => cb => fs.readFile(fil, 'utf8', cb);
var wait = (sec, val) => cb => setTimeout(cb, sec * 1000, null, val);
var xxxx = sec => cb => setTimeout(cb, sec * 1000, new Error('always error'));
var slice = [].slice;
var nextTick = typeof process === 'object' && process && process.nextTick || setImmediate;

var next$count = 0;
var next$progress = false;
var next$head = undefined, next$tail = undefined;
function next(/* cb, err, val,... */) {
	if (next$head) return next$tail = next$tail.$next = arguments;
	next$head = next$tail = arguments;
	if (next$progress) return;
	next$progress = true;
	++next$count > 50 ? (next$count = 0, nextTick(nextTask)) : nextTask();
}
var next$argscbs = [
	args => undefined,
	args => args[0](),
	args => args[0](args[1]),
	args => args[0](args[1], args[2]),
	args => args[0](args[1], args[2], args[3])
];
function nextTask() {
	while (next$head) {
		var args = next$head;
		if (next$head === next$tail)
			next$head = next$tail = undefined;
		else
			next$head = next$head.$next;
		next$argscbs[args.length](args);
	}
	next$progress = false;
}

var GeneratorFunction = function *() {}.constructor;
//console.log('GeneratorFunction.name ==', GeneratorFunction.name);
GeneratorFunction.prototype.aa$callback = function (cb) { gencb(this(), cb); };
         Function.prototype.aa$callback = function (cb) { next(this, normalcb(cb)); };
var valcb = (val, cb) => next(cb, null, val);
var errcb = (err, cb) => next(cb, err);
var funcb = (fun, cb) => fun.aa$callback(cb);
var anycb = (val, cb) => typecbs[typeof val](val, cb);
var clscb = (val, cb) => val ? ctorcb(val.constructor.name || 'other', val, cb) : next(cb, null, val);
var ctorcb = (name, val, cb) => (ctorcbs[name] ? ctorcbs[name] : ctorcbs.other)(val, cb);
var promisecb = (promise, cb) => promise.then(val => cb(null, val), cb);
var typecbs = {
	'function':  funcb,
	'object':    clscb,
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
		objcb(val, cb),
	'Array':   parcb, //valcb, //(val, cb) => next(cb, null, val),
	'Error':   errcb,
	'Promise': promisecb,
	'other':  (val, cb) =>
		typeof val.next === 'function' && typeof val.throw === 'function' ? gencb(val, cb) :
		typeof val.then === 'function' ? promisecb(val, cb) :
		val instanceof Error ? next(cb, val) :
		val.constructor === Array ? parcb(val, cb) :
		objcb(val, cb)
};
function parcb(args, cb) {
	var n = args.length;
	if (n === 0) return next(cb, null, []);
	var result = Array(n);
	try {
		args.forEach((arg, i) => anycb(arg,
			(err, val) => err ? cb(err) : chk(val, i)));
	} catch (err) { cb(err); }
	function chk(val, i) {
		result[i] = val;
		--n || next(cb, null, result);
	}
}
function objcb(args, cb) {
	var keys = (Object.getOwnPropertyNames || Object.keys)(args);
	var n = keys.length;
	if (n === 0) return next(cb, null, {});
	var result = {};
	try {
		keys.forEach((key, i) => (result[key] = undefined, anycb(args[key],
			(err, val) => err ? cb(err) : chk(val, key))));
	} catch (err) { cb(err); }
	function chk(val, key) {
		result[key] = val;
		--n || next(cb, null, result);
	}
}

/*
var co3 = gen => callback => {
	var cb = function (err, val) {
		try {
			val = err ? gen.throw(err) : gen.next(val);
			val.done ? callback(null, val.value) : anycb(val.value, cb);
		} catch (err) { callback(err); }
	}; cb();
};

var co4 = gen => new Promise((res, rej) => {
	var cb = function (err, val) {
		try {
			val = err ? gen.throw(err) : gen.next(val);
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

function normalcb(cb) {
	return function (err, val) {
		if (err != null)
			if (err instanceof Error) return cb(err);
			else cb(null, slice0(arguments, arguments.length));
		else cb(null, slice1(arguments, arguments.length));
		//cb(null, val);
	};
}

var gencb = (gen, callback) => {
	next(cb);
	function cb(err, val) {
		try {
			if (err) val = gen.throw(err);
			else {
				if (typeof val === 'function')
					return funcb(val, cb);
				if (typeof val === 'object' && val) {
					if (typeof val.then === 'function')
						return promisecb(val, cb);
					if (typeof val.next === 'function' &&
					    typeof val.throw === 'function')
						return gencb(val, cb);
				}
				val = gen.next(val);
			}
			val.done ? anycb(val.value, callback) : anycb(val.value, cb);
		} catch (err) { callback(err); }
	}
};

function fork(gen) {
	var resolve, reject, callback, result;
	var p = new Promise((res, rej) => (resolve = res, reject = rej));
	function thunk(cb) {
		callback = cb;
		result && callback.apply(null, result);
	}
	nextTick(cb);
	thunk.then = p.then.bind(p);
	thunk['catch'] = p['catch'].bind(p);
	return thunk;

	function cb(err, val) {
		try {
			if (err) val = gen.throw(err);
			else {
				if (typeof val === 'function')
					return funcb(val, cb);
				if (typeof val === 'object' && val) {
					if (typeof val.then === 'function')
						return promisecb(val, cb);
					if (typeof val.next === 'function' &&
					    typeof val.throw === 'function')
						return gencb(val, cb);
				}
				val = gen.next(val);
			}
			val.done ?
				anycb(val.value, (err, val) => err ? rej(err) : res(val)) :
				anycb(val.value, cb);
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
}

function errmsg(e) {
	return e instanceof Error ? '\x1b[31m' + e.stack + '\x1b[m' : e;
}

fork(function *() {
	//console.log(yield read('README.md'));
	yield wait(0.1);
	//console.log(yield read('package.json'));
	//throw new Error('xxxx');

	try { yield xxxx(0.1); }
	catch (e) { console.error(errmsg(e)); }

	console.log('error caught!');
	console.log('expected: cb 123    ==', yield cb => cb(null, 123));
	console.log('expected: 123       ==', yield 123);
	console.log('expected: undefined ==', yield undefined);
	console.log('expected: null      ==', yield null);
	console.log('expected: 1.23      ==', yield 1.23);
	console.log('expected: "str"     ==', yield 'str');
	console.log('expected: true      ==', yield true);
	console.log('expected: false     ==', yield false);
	console.log('expected: {}        ==', yield {});
	console.log('expected: []        ==', yield []);
	console.log('expected: Promise 1 ==', yield Promise.resolve(1));
	console.log('expected: Promise 2 ==', yield Promise.resolve(Promise.resolve(2)));
	console.log('expected: cb cb 123 ==', yield cb => cb(null, cb => cb(null, 123)));

	if (123       !== (yield 123))       throw new Error('eh!?');
	if (undefined !== (yield undefined)) throw new Error('eh!?');
	if (null      !== (yield null))      throw new Error('eh!?');
	if (1.23      !== (yield 1.23))      throw new Error('eh!?');
	if ('str'     !== (yield 'str'))     throw new Error('eh!?');
	if (true      !== (yield true))      throw new Error('eh!?');
	if (false     !== (yield false))     throw new Error('eh!?');
	if (JSON.stringify(yield {}) !== '{}') throw new Error('eh!?');
	if (JSON.stringify(yield []) !== '[]') throw new Error('eh!?');

	var loops = [5e4, 5e4, 5e4, 5e4, 1e5, 1e5, 1e5, 1e5, 2e5, 1e6, 2e6, 1e7];
	for (var j in loops) {
		//var time = Date.now();
		var x = process.hrtime();
		for (var i = 0, N = loops[j]; i < N; ++i)
			if (i !== (yield test(i)))
			//if (i !== (yield Promise.resolve(i)))
				throw new Error('eh!? ' + i);
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

	console.log('GeneratorFunction() 123 ==', yield function*() { yield wait(0.1); return 123; }());
	console.log('GeneratorFunction   123 ==', yield function*() { yield wait(0.1); return 123; });
	console.log('GeneratorFunction() 456 ==', yield function*() { yield wait(0.1); return Promise.resolve(456); }());
	console.log('GeneratorFunction   456 ==', yield function*() { yield wait(0.1); return Promise.resolve(456); });
	console.log('GeneratorFunction() 789 ==', yield function*() { yield wait(0.1); return cb => cb(null, 789); }());
	console.log('GeneratorFunction   789 ==', yield function*() { yield wait(0.1); return cb => cb(null, 789); });
	console.log('[w, w]         ==', yield [wait(0.2, 0.2), wait(0.1, 0.1)]);
	console.log('{x:w, y:w}     ==', yield {x:wait(0.2, 0.2), y:wait(0.1, 0.1)});
	console.log('[[w, w]]       ==', yield [[wait(0.2, 0.2), wait(0.1, 0.1)]]);
	console.log('{x:[w], y:{z:w}} ==', yield {x:[wait(0.2, 0.2)], y:{z:wait(0.1, 0.1)}});

	console.log('expected: 100           ==', yield cb => cb(null, 100));
	console.log('expected: [101,102]     ==', yield cb => cb(null, 101, 102));
	console.log('expected: [103,104,105] ==', yield cb => cb(null, 103, 104, 105));
	console.log('expected: [0,106]       ==', yield cb => cb(0, 106));
	console.log('expected: ["",107]      ==', yield cb => cb('', 107));
	console.log('expected: [108,109]     ==', yield cb => cb(108, 109));
	console.log('expected: [110,111,112] ==', yield cb => cb(110, 111, 112));
	//console.log('err?', yield new TypeError('09876'));
	//console.log('err?', yield new Error('54321'));
	//throw new Error('67890');
	//return Promise.resolve('12345');
	//return Promise.reject(new Error('12345'));
	return 12345;
//}()).then(val => console.log('finished: val:', val), err => console.error('finished: err:', errmsg(err)));
}())((err, val) => console.log('finished: err:', errmsg(err), 'val:', val));
