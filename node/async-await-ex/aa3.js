// Callbacks vs Coroutines
// A look ad callbacks vs generators vs coroutines
// https://medium.com/@tjholowaychuk/callbacks-vs-coroutines-174f1fe66127

// co@3 : thunk version
// co@4 : Promise version

void function () {
'use strict';

var slice = [].slice;
var nextTick = typeof process === 'object' && process ? process.nextTick :
	typeof setImmediate === 'function' ? setImmediate :
	function (cb) {
		var args = [cb, 0].concat(slice.call(arguments, 1));
		setTimeout.apply(null, args);
	};

var next = function () {
	var NEXT_MAX = 50;
	var count = 0;
	var progress = false;
	var head = undefined;
	var tail = undefined;

	function next(/* cb, err, val,... */) {
		if (head)
			return tail = tail.next_next = arguments;
		head = tail = arguments;
		if (progress) return;
		progress = true;
		++count >= NEXT_MAX ? (count = 0, nextTick(nextTask)) : nextTask();
	}
	var argscbs = [
		function (args) { return undefined; },
		function (args) { return args[0](); },
		function (args) { return args[0](args[1]); },
		function (args) { return args[0](args[1], args[2]); },
		function (args) { return args[0](args[1], args[2], args[3]); },
		function (args) { return args[0](args[1], args[2], args[3], args[4]); }
	];
	function nextTask() {
		while (head) {
			var args = head;
			if (head === tail)
				head = tail = undefined;
			else
				head = head.next_next;
			argscbs[args.length](args);
		}
		progress = false;
	}

	return next;
}();

var GeneratorFunction = function *() {}.constructor;
GeneratorFunction.prototype.aa$callback = function (cb) { gtorcb(this(), cb); };
         Function.prototype.aa$callback = function (cb) { next(this, normalcb(cb)); };

function valcb(val, cb) { next(cb, null, val); }
function errcb(err, cb) { next(cb, err); }
function funcb(fun, cb) { fun.aa$callback(cb); }
function anycb(val, cb) { typecbs[typeof val](val, cb); }
function clscb(val, cb) { val ? ctorcb(val.constructor.name || '$', val, cb) : next(cb, null, val); }
function ctorcb(name, val, cb) { (ctorcbs[name] ? ctorcbs[name] : ctorcbs.$)(val, cb); }
function promisecb(promise, cb) { promise.then(function (val) { cb(null, val); }, cb); }

// typecbs[typeof val](val, cb) for any type of value
var typecbs = {
	'function': funcb,
	object:     clscb,
	number:     valcb,
	string:     valcb,
	boolean:    valcb,
	symbol:     valcb,
	xml:        valcb,
	undefined:  valcb
};

// ctorcbs(val, cb) by constructor.name
var ctorcbs = {
	Object: function (val, cb) {
		typeof val.next === 'function' && typeof val.throw === 'function' ? gtorcb(val, cb) :
		typeof val.then === 'function' ? promisecb(val, cb) :
		objcb(val, cb); },
	Array: parcb,
	Error: errcb,
	Promise: promisecb,
	$: function (val, cb) {
		typeof val.next === 'function' && typeof val.throw === 'function' ? gtorcb(val, cb) :
		typeof val.then === 'function' ? promisecb(val, cb) :
		val instanceof Error ? next(cb, val) :
		val.constructor === Array ? parcb(val, cb) :
		objcb(val, cb); }
};

// parcb(args, cb) for Array
function parcb(args, cb) {
	var n = args.length, result = Array(n);
	if (n === 0) return next(cb, null, result);
	args.forEach(function (arg, i) {
		anycb(arg, function (err, val) {
			err ? (n = 0, cb(err)) :
				((result[i] = val), (--n || next(cb, null, result)));
		});
	});
}

// objcb(args, cb) for Object
function objcb(args, cb) {
	var keys = (Object.getOwnPropertyNames || Object.keys)(args);
	var n = keys.length, result = {};
	if (n === 0) return next(cb, null, result);
	keys.forEach(function (key, i) {
		result[key] = undefined;
		anycb(args[key], function (err, val) {
			err ? (n = 0, cb(err)) :
				((result[key] = val), (--n || next(cb, null, result)));
		});
	});
}

// seqcb(args, cb) for sequential tasks
function seqcb(args, cb) {
	var n = args.length, result = Array(n);
	if (n === 0) return next(cb, null, result);
	anycb(args[0], function (err, val) { chk(val, 0); });
	function chk(x, i) {
		result[i] = x;
		if (++i < n) next(anycb, args[i], function (err, val) { chk(val, i); });
		else cb(null, result);
	}
}

/*
// co3
function co3(gtor) {
	return function (callback) {
		nextTick(cb);
		function cb(err, val) {
			try {
				val = err ? gtor.throw(err) : gtor.next(val);
				anycb(val.value, val.done ? callback : cb);
			} catch (err) { callback(err); }
		}
	};
}

// co4
function co4(gtor) {
	return new Promise(function (resolve, reject) {
		nextTick(cb);
		function callback(err, val) {
			err ? reject(err) : resolve(val);
		}
		function cb(err, val) {
			try {
				val = err ? gtor.throw(err) : gtor.next(val);
				anycb(val.value, val.done ? callback : cb);
			} catch (err) { reject(err); }
		}
	});
}
*/

var slices0 = [
	function (args) { return undefined; },
	function (args) { return args[0]; },
	function (args) { return [args[0], args[1]]; },
	function (args) { return [args[0], args[1], args[2]]; },
	function (args) { return [args[0], args[1], args[2], args[3]]; },
	function (args) { return [args[0], args[1], args[2], args[3], args[4]]; }
];
var slices1 = [
	function (args) { return undefined; },
	function (args) { return undefined; },
	function (args) { return args[1]; },
	function (args) { return [args[1], args[2]]; },
	function (args) { return [args[1], args[2], args[3]]; },
	function (args) { return [args[1], args[2], args[3], args[4]]; }
];
//var slice0 = function (args, len) { return len <= 5 ? slices0[len](args) : slice.call(args); };
//var slice1 = function (args, len) { return len <= 5 ? slices1[len](args) : slice.call(args, 1); };

function normalcb(cb) {
	return function (err, val) {
		if (err != null)
			if (err instanceof Error) return cb(err);
			else cb(null, slices0[arguments.length](arguments));
		else cb(null, slices1[arguments.length](arguments));
	};
} // normalcb

function gtorcb(gtor, callback) {
	next(cb);
	function cb(err, val) {
		try {
			if (err) val = gtor.throw(err);
			else {
				if (typeof val === 'function')
					return val.aa$callback(cb); //funcb(val, cb);
				if (typeof val === 'object' && val) {
					if (typeof val.then === 'function')
						return promisecb(val, cb);
					if (typeof val.next === 'function' &&
					    typeof val.throw === 'function')
						return gtorcb(val, cb);
				}
				val = gtor.next(val);
			}
			anycb(val.value, val.done ? callback : cb);
		} catch (err) { callback(err); }
	}
} // gtorcb

function fork(val) {
	var resolve, reject, callback, result;
	var promise = new Promise(function (res, rej) { resolve = res; reject = rej; });
	if (arguments.length <= 1)
		nextTick(anycb, val, cb);
	else
		nextTick(seqcb, arguments, cb);
	thunk.then = promise.then.bind(promise);
	thunk['catch'] = promise['catch'].bind(promise);
	return thunk;

	function thunk(cb) {
		callback = cb;
		try { result && callback.apply(null, result); }
		catch (err) { return reject(err); }
	}
	function cb(err, val) {
		err ? reject(err) : resolve(val);
		result = arguments;
		try { callback && callback.apply(null, result); }
		catch (err) { return reject(err); }
	}
} // fork

module.exports = fork;
}();
