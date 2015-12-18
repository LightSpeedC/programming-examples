// Callbacks vs Coroutines
// A look ad callbacks vs generators vs coroutines
// https://medium.com/@tjholowaychuk/callbacks-vs-coroutines-174f1fe66127

// co@3 : thunk version
// co@4 : Promise version

void function () {
'use strict';

var slice = [].slice;
var nextTick = typeof process === 'object' && process && process.nextTick ||
	typeof setImmediate === 'function' && setImmediate ||
	function (cb) {
		var args = [cb, 0].concat(slice.call(arguments, 1));
		setTimeout.apply(null, args);
	};

var next = function () {
	var NEXT_MAX = 50;
	var next_count = 0;
	var next_progress = false;
	var next_head = undefined, next_tail = undefined;

	function next(/* cb, err, val,... */) {
		if (next_head) return next_tail = next_tail.next_next = arguments;
		next_head = next_tail = arguments;
		if (next_progress) return;
		next_progress = true;
		++next_count > NEXT_MAX ? (next_count = 0, nextTick(nextTask)) : nextTask();
	}
	var next_argscbs = [
		args => undefined,
		args => args[0](),
		args => args[0](args[1]),
		args => args[0](args[1], args[2]),
		args => args[0](args[1], args[2], args[3]),
		args => args[0](args[1], args[2], args[3], args[4])
	];
	function nextTask() {
		while (next_head) {
			var args = next_head;
			if (next_head === next_tail)
				next_head = next_tail = undefined;
			else
				next_head = next_head.next_next;
			next_argscbs[args.length](args);
		}
		next_progress = false;
	}

	return next;
}();

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
	'Array':   parcb,
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
	args => [args[0], args[1], args[2], args[3]],
	args => [args[0], args[1], args[2], args[3], args[4]]
];
var slices1 = [
	args => undefined,
	args => undefined,
	args => args[1],
	args => [args[1], args[2]],
	args => [args[1], args[2], args[3]],
	args => [args[1], args[2], args[3], args[4]]
];
var slice0 = (args, len) => slices0[len] ? slices0[len](args) : slice.call(args);
var slice1 = (args, len) => slices1[len] ? slices1[len](args) : slice.call(args, 1);

function normalcb(cb) {
	return function (err, val) {
		if (err != null)
			if (err instanceof Error) return cb(err);
			else cb(null, slice0(arguments, arguments.length));
		else cb(null, slice1(arguments, arguments.length));
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
	nextTick(gencb, gen, (err, val) => err ? rej(err) : res(val))
	thunk.then = p.then.bind(p);
	thunk['catch'] = p['catch'].bind(p);
	return thunk;

	function thunk(cb) {
		callback = cb;
		result && callback.apply(null, result);
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

module.exports = fork;
}();
