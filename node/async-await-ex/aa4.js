// Callbacks vs Coroutines
// A look ad callbacks vs generators vs coroutines
// https://medium.com/@tjholowaychuk/callbacks-vs-coroutines-174f1fe66127

// co@3 : thunk version
// co@4 : Promise version

void function () {
	'use strict';

	var slice = [].slice;

	// Object_keys
	var Object_keys = Object.getOwnPropertyNames || Object.keys ||
		function (obj) {
			var keys = [];
			for (var prop in obj)
				if (obj.hasOwnProperty(prop)) keys.push(prop);
			return keys;
		};


	// defProp
	var defProp = function () {
		var obj = {};
		if (!Object.defineProperty) return null;
		try {
			Object.defineProperty(obj, 'prop', {value: 'str'});
			return obj.prop === 'str' ? Object.defineProperty : null;
		} catch (err) { return null; }
	} ();

	// setConst(obj, prop, val)
	var setConst = defProp ?
		function setConst(obj, prop, val) {
			defProp(obj, prop, {value: val}); } :
		function setConst(obj, prop, val) { obj[prop] = val; };

	// setValue(obj, prop, val)
	var setValue = defProp ?
		function setValue(obj, prop, val) {
			defProp(obj, prop, {value: val,
				writable: true, configurable: true}); } :
		function setValue(obj, prop, val) { obj[prop] = val; };

	// setProto(obj, proto)
	var setProto = Object.setPrototypeOf || {}.__proto__ ?
		function setProto(obj, proto) { obj.__proto__ = proto; } : null;


	// GeneratorFunction
	try {
		var GeneratorFunction = Function('return function*(){}.constructor')();
		GeneratorFunction.toString();
		setValue(aa, 'GeneratorFunction', GeneratorFunction);
	} catch (e) {}

	// GeneratorFunctionPrototype
	try {
		var GeneratorFunctionPrototype = Function('return (function*(){})().constructor')();
		GeneratorFunctionPrototype.toString();
		setValue(aa, 'GeneratorFunctionPrototype', GeneratorFunctionPrototype);
	} catch (e) {}

	// isGeneratorFunction
	setValue(aa, 'isGeneratorFunction', isGeneratorFunction);
	function isGeneratorFunction(gtor) {
		if (!gtor) return false;
		var ctor = gtor.constructor;
		return ctor === GeneratorFunction ||
			(ctor.displayName || ctor.name) === 'GeneratorFunction';
	}

	// isGenerator
	setValue(aa, 'isGenerator', isGenerator);
	function isGenerator(gtor) {
		if (!gtor) return false;
		var ctor = gtor.constructor;
		return ctor === GeneratorFunctionPrototype ||
			(ctor.displayName || ctor.name) === 'GeneratorFunctionPrototype' ||
			typeof gtor.next === 'function';
	}


	// nextTickDo(fn, args,...)
	var nextTickDo = typeof process === 'object' && process ? process.nextTick :
		typeof setImmediate === 'function' ? setImmediate :
		function (cb) {
			var args = [cb, 0].concat(slice.call(arguments, 1));
			setTimeout.apply(null, args);
		};

	// nextTick(fn, args,...)
	var nextTick = function () {
		var NEXT_MAX = 50;
		var count = 0;
		var progress = false;
		var head = undefined;
		var tail = undefined;

		function nextTick(/* cb, err, val,... */) {
			if (head)
				return tail = tail.next_next = arguments;
			head = tail = arguments;
			if (progress) return;
			progress = true;
			++count >= NEXT_MAX ? (count = 0, nextTickDo(nextTask)) : nextTask();
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

		return nextTick;
	}();

	if (GeneratorFunction)
		GeneratorFunction.prototype.aa$callback = function (cb) { gtorcb(this(), cb); };
	Function.prototype.aa$callback = function (cb) { nextTick(this, normalcb(cb)); };

	function valcb(val, cb) { nextTick(cb, null, val); }
	function errcb(err, cb) { nextTick(cb, err); }
	function funcb(fun, cb) { fun.aa$callback(cb); }
	function anycb(val, cb) { typecbs[typeof val](val, cb); }
	function clscb(val, cb) { val ? ctorcb(val.constructor.displayName || val.constructor.name || '$', val, cb) : nextTick(cb, null, val); }
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
			typeof val.next === 'function' && typeof val['throw'] === 'function' ? gtorcb(val, cb) :
			typeof val.then === 'function' ? promisecb(val, cb) :
			objcb(val, cb); },
		Array: parcb,
		Error: errcb,
		Promise: promisecb,
		$: function (val, cb) {
			typeof val.next === 'function' && typeof val['throw'] === 'function' ? gtorcb(val, cb) :
			typeof val.then === 'function' ? promisecb(val, cb) :
			val instanceof Error ? nextTick(cb, val) :
			val.constructor === Array ? parcb(val, cb) :
			objcb(val, cb); }
	};

	// parcb(args, cb) for Array
	function parcb(args, cb) {
		var n = args.length, result = Array(n);
		if (n === 0) return nextTick(cb, null, result);
		args.forEach(function (arg, i) {
			anycb(arg, function (err, val) {
				if (err) {
					if (n > 0) n = 0, cb(err);
				}
				else {
					result[i] = val;
					--n || nextTick(cb, null, result);
				}
			});
		});
	}

	// objcb(args, cb) for Object
	function objcb(args, cb) {
		var keys = Object_keys(args);
		var n = keys.length, result = {};
		if (n === 0) return nextTick(cb, null, result);
		keys.forEach(function (key) {
			result[key] = undefined;
			anycb(args[key], function (err, val) {
				if (err) {
					if (n > 0) n = 0, cb(err);
				}
				else {
					result[key] = val;
					--n || nextTick(cb, null, result);
				}
			});
		});
	}

	// seqcb(args, cb) for sequential tasks
	function seqcb(args, cb) {
		var n = args.length, result = Array(n);
		if (n === 0) return nextTick(cb, null, result);
		anycb(args[0], function (err, val) { chk(val, 0); });
		function chk(x, i) {
			result[i] = x;
			if (++i < n) nextTick(anycb, args[i], function (err, val) { chk(val, i); });
			else cb(null, result);
		}
	}

	/*
	// co3
	function co3(gtor) {
		return function (callback) {
			nextTickDo(cb);
			function cb(err, val) {
				try {
					val = err ? gtor['throw'](err) : gtor.next(val);
					anycb(val.value, val.done ? callback : cb);
				} catch (err) { callback(err); }
			}
		};
	}

	// co4
	function co4(gtor) {
		return new Promise(function (resolve, reject) {
			nextTickDo(cb);
			function callback(err, val) { err ? reject(err) : resolve(val); }
			function cb(err, val) {
				try {
					val = err ? gtor['throw'](err) : gtor.next(val);
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
		nextTick(cb);
		function cb(err, val) {
			try {
				if (err) {
					if (typeof gtor['throw'] !== 'function')
						return callback(err);
					val = gtor['throw'](err);
				}
				else {
					if (typeof val === 'function')
						return val.aa$callback(cb); //funcb(val, cb);
					if (typeof val === 'object' && val) {
						if (typeof val.then === 'function')
							return promisecb(val, cb);
						if (typeof val.next === 'function' &&
						    typeof val['throw'] === 'function')
							return gtorcb(val, cb);
					}
					val = gtor.next(val);
				}
				anycb(val.value, val.done ? callback : cb);
			} catch (err) { callback(err); }
		}
	} // gtorcb

	// aa - async-await
	function aa(val) {
		var resolve, reject, callback, result;
		var promise = new Promise(function (res, rej) { resolve = res; reject = rej; });
		if (arguments.length <= 1)
			nextTickDo(anycb, val, cb);
		else
			nextTickDo(seqcb, arguments, cb);
		thunk.then = promise.then.bind(promise);
		thunk['catch'] = promise['catch'].bind(promise);
		return thunk;

		function thunk(cb) {
			callback = cb;
			try { result && callback.apply(null, result); }
			catch (err) { reject(err); }
		}
		function cb(err, val) {
			err ? reject(err) : resolve(val);
			result = arguments;
			try { callback && callback.apply(null, result); }
			catch (err) { reject(err); }
		}
	} // aa


	// Channel(empty)
	// recv: chan(cb)
	// send: chan(err, data)
	// send: chan() or chan(undefined)
	// send: chan(data)
	// chan.end()
	// chan.empty
	// chan.done()
	// chan.send(val or err)
	// chan.recv(cb)

	if (setProto)
		setProto(Channel.prototype, Function.prototype);
	else {
		Channel.prototype = Function();
		Channel.prototype.constructor = Channel;
	}

	// aa.Channel()
	setValue(aa, 'Channel', Channel);
	setValue(aa, 'chan', Channel);

	// Channel(empty)
	function Channel(empty) {
		if (arguments.length > 1)
			throw new Error('Channel: too many arguments');

		channel.$isClosed = false;    // send stream is closed
		channel.$isDone = false;      // receive stream is done
		channel.$recvCallbacks = [];  // receive pending callbacks queue
		channel.$sendValues    = [];  // send pending values

		channel.empty = typeof empty === 'function' ? new empty() : empty;

		if (setProto)
			setProto(channel, Channel.prototype);
		else {
			channel.close = $$close;
			channel.done  = $$done;
			channel.send  = $$send;
			channel.recv  = $$recv;

			// for stream
			channel.end      = $$close;
			channel.stream   = $$stream;

			if (channel.call !== Function.prototype.call)
				channel.call = Function.prototype.call;

			if (channel.apply !== Function.prototype.apply)
				channel.apply = Function.prototype.apply;
		}

		return channel;

		function channel(a, b) {
			// yield callback
			if (typeof a === 'function')
				return channel.recv(a);

			// error
			if (a instanceof Error)
				return channel.send(a);

			// value or undefined
			if (arguments.length <= 1)
				return channel.send(a);

			var args = slice.call(arguments);

			if (a == null) {
				if (arguments.length === 2)
					return channel.send(b);
				else
					args.shift();
			}

			// (null, value,...) -> [value, ...]
			return channel.send(args);
		}

	} // Channel

	// send(val or err)
	var $$send = Channel.prototype.send = send;
	function send(val) {
		if (this.$isClosed)
			throw new Error('Cannot send to closed channel');
		else if (this.$recvCallbacks.length > 0)
			complete(this.$recvCallbacks.shift(), val);
		else
			this.$sendValues.push(val);
	} // send

	// recv(cb)
	var $$recv = Channel.prototype.recv = recv;
	function recv(cb) {
		if (this.done())
			cb(null, this.empty);
		else if (this.$sendValues.length > 0)
			complete(cb, this.$sendValues.shift());
		else
			this.$recvCallbacks.push(cb);
		return;
	} // recv

	// done()
	var $$done = Channel.prototype.done = done;
	function done() {
		if (!this.$isDone && this.$isClosed && this.$sendValues.length === 0) {
			this.$isDone = true;
			// complete each pending callback with the empty value
			var empty = this.empty;
			this.$recvCallbacks.forEach(function(cb) { complete(cb, empty); });
		}

		return this.$isDone;
	} // done

	// close() end()
	var $$close = Channel.prototype.close = Channel.prototype.end = close;
	function close() {
		this.$isClosed = true;
		return this.done();
	} // close

	// stream(reader)
	var $$stream = Channel.prototype.stream = stream;
	function stream(reader) {
		var channel = this;
		reader.on('end',      close);
		reader.on('error',    error);
		reader.on('readable', readable);
		return this;

		function close()    { return channel.close(); }
		function error(err) { return channel.send(err); }

		function readable() {
			var buf = this.read();
			if (!buf) return;
			channel.send(buf);
		} // readable
	} // stream

	// complete(cb, val or err)
	function complete(cb, val) {
		if (val instanceof Error)
			cb(val);
		else
			cb(null, val);
	} // complete

	// aa.wait(msec, val)
	setValue(aa, 'wait', wait);
	function wait(msec, val) {
		return function (cb) {
			setTimeout(cb, msec, null, val);
		};
	}


	// aa.thunkify(fn)
	setValue(aa, 'thunkify', thunkify);
	function thunkify(fn, options) {
		// thunkify(object target, string method, [object options]) : undefined
		if (fn && typeof fn === 'object' && options && typeof options === 'string') {
			var object = fn, method = options, options = arguments[2];
			var suffix = options && typeof options === 'string' ? options :
				options && typeof options.suffix === 'string' ? options.suffix :
				options && typeof options.postfix === 'string' ? options.postfix : 'Async';
			var methodAsyncCached = method + suffix + 'Cached';
			Object.defineProperty(object, method + suffix, {
				get: function () {
					return this.hasOwnProperty(methodAsyncCached) &&
						typeof this[methodAsyncCached] === 'function' ? this[methodAsyncCached] :
						setValue(this, methodAsyncCached, thunkify(this, this[method]));
				},
				configurable: true
			});
			return;
		}

		// thunkify([object ctx,] function fn) : function
		var ctx = typeof this !== 'function' ? this : undefined;
		if (typeof options === 'function') ctx = fn, fn = options, options = arguments[2];
		if (options && options.context) ctx = options.context;
		if (typeof fn !== 'function')
			throw new TypeError('thunkify: argument must be a function');

		// thunkified
		thunkified.thunkified = true;
		return thunkified;

		function thunkified() {
			var result, callbacks = [], unhandled;
			arguments[arguments.length++] = function callback(err, val) {
				if (result) {
					if (err)
						console.error(COLOR_ERROR + 'Unhandled callback error: ' + err2str(err) + COLOR_NORMAL);
					return;
				}

				result = arguments;
				if (callbacks.length === 0 && err instanceof Error)
					unhandled = true,
					console.error(COLOR_ERROR + 'Unhandled callback error: ' + err2str(err) + COLOR_NORMAL);

				for (var i = 0, n = callbacks.length; i < n; ++i)
					fire(callbacks[i]);
				callbacks = [];
			};
			fn.apply(ctx, arguments);

			// thunk
			return function thunk(cb) {
				if (typeof cb !== 'function')
					throw new TypeError('argument must be a function');

				if (unhandled)
					unhandled = false,
					console.error(COLOR_ERROR + 'Unhandled callback error handled: ' + err2str(result[0]) + COLOR_NORMAL);

				if (result) return fire(cb);
				callbacks.push(cb);
			};

			// fire
			function fire(cb) {
				var err = result[0], val = result[1];
				try {
					return err instanceof Error || result.length === cb.length ? cb.apply(ctx, result) :
						// normal node style callback
						result.length === 2 ? cb.call(ctx, err, val) :
						// fs.exists like callback, arguments[0] is value
						result.length === 1 ? cb.call(ctx, null, result[0]) :
						// unknown callback
						result.length === 0 ? cb.call(ctx) :
						// child_process.exec like callback
						cb.call(ctx, null, slice.call(result, err == null ? 1 : 0));
				} catch (e) { cb.call(ctx, e); }
			} // fire
		}; // thunkified
	} // thunkify


	// aa.promisify(fn)
	setValue(aa, 'promisify', promisify);
	function promisify(fn, options) {
		// promisify(object target, string method, [object options]) : undefined
		if (fn && typeof fn === 'object' && options && typeof options === 'string') {
			var object = fn, method = options, options = arguments[2];
			var suffix = options && typeof options === 'string' ? options :
				options && typeof options.suffix === 'string' ? options.suffix :
				options && typeof options.postfix === 'string' ? options.postfix : 'Async';
			var methodAsyncCached = method + suffix + 'Cached';
			Object.defineProperty(object, method + suffix, {
				get: function () {
					return this.hasOwnProperty(methodAsyncCached) &&
						typeof this[methodAsyncCached] === 'function' ? this[methodAsyncCached] :
						setValue(this, methodAsyncCached, promisify(this, this[method]));
				},
				configurable: true
			});
			return;
		}

		// promisify([object ctx,] function fn) : function
		var ctx = typeof this !== 'function' ? this : undefined;
		if (typeof options === 'function') ctx = fn, fn = options, options = arguments[2];
		if (options && options.context) ctx = options.context;
		if (typeof fn !== 'function')
			throw new TypeError('promisify: argument must be a function');

		// promisified
		promisified.promisified = true;
		return promisified;

		function promisified() {
			var args = arguments;
			return new Promise(function (res, rej) {
				args[args.length++] = function callback(err, val) {
					try {
						return err instanceof Error ? rej(err) :
							// normal node style callback
							arguments.length === 2 ? (err ? rej(err) : res(val)) :
							// fs.exists like callback, arguments[0] is value
							arguments.length === 1 ? res(arguments[0]) :
							// unknown callback
							arguments.length === 0 ? res() :
							// child_process.exec like callback
							res(slice.call(arguments, err == null ? 1 : 0));
					} catch (e) { rej(e); }
				};
				fn.apply(ctx, args);
			});
		};
	} // promisify


	// aa.thunkifyAll(object, options)
	setValue(aa, 'thunkifyAll', thunkifyAll);
	function thunkifyAll(object, options) {
		var keys = Object_keys(object);

		keys.forEach(function (method) {
			if (typeof object[method] === 'function' &&
					!object[method].promisified &&
					!object[method].thunkified)
				thunkify(object, method, options);
		});
		return object;
	}

	// aa.promisifyAll(object, options)
	setValue(aa, 'promisifyAll', promisifyAll);
	function promisifyAll(object, options) {
		var keys = Object_keys(object);

		keys.forEach(function (method) {
			if (typeof object[method] === 'function' &&
					!object[method].promisified &&
					!object[method].thunkified)
				promisify(object, method, options);
		});
		return object;
	}


	// isPromise(promise)
	setValue(aa, 'isPromise', isPromise);
	function isPromise(promise) {
		return !!promise && typeof promise.then === 'function';
	}

	// isIterator(iter)
	setValue(aa, 'isIterator', isIterator);
	function isIterator(iter) {
		return !!iter && (typeof iter.next === 'function' || isIterable(iter));
	}

	// isIterable(iter)
	setValue(aa, 'isIterable', isIterable);
	function isIterable(iter) {
		return !!iter && typeof Symbol === 'function' &&
				!!Symbol.iterator && typeof iter[Symbol.iterator] === 'function';
	}

	// makeArrayFromIterator(iter or array)
	setValue(aa, 'makeArrayFromIterator', makeArrayFromIterator);
	function makeArrayFromIterator(iter) {
		if (iter instanceof Array) return iter;
		if (!isIterator(iter)) return [iter];
		if (isIterable(iter)) iter = iter[Symbol.iterator]();
		var array = [];
		try {
			for (;;) {
				var val = iter.next();
				if (val && val.hasOwnProperty('done') && val.done) return array;
				if (val && val.hasOwnProperty('value')) val = val.value;
				array.push(val);
			}
		} catch (error) {
			return array;
		}
	} // makeArrayFromIterator


	setValue(aa, 'aa', aa);
	if (typeof module === 'object' && module && module.exports)
		module.exports = aa;
}();
