(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = setTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    clearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        setTimeout(drainQueue, 0);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],2:[function(require,module,exports){
// ES6 Async Await and Babel with npm regenerator.runtime()

// var aa = require('aa');
'use strict';

var marked0$0 = [main, sub].map(regeneratorRuntime.mark);
var aa = undefined && undefined.aa || require('aa');
var Promise = aa.Promise;

console.log('main: start');
aa(main()).then(function (val) {
	console.log('main: finish:', val);
});

function main() {
	var result;
	return regeneratorRuntime.wrap(function main$(context$1$0) {
		while (1) switch (context$1$0.prev = context$1$0.next) {
			case 0:
				console.log('main: started');

				// シーケンシャル処理(逐次処理)
				context$1$0.next = 3;
				return sleep(2000, 'a1');

			case 3:
				result = context$1$0.sent;

				console.log('main-a1: simple Promise: a1 =', result);
				context$1$0.next = 7;
				return sleep(2000, 'a2');

			case 7:
				result = context$1$0.sent;

				console.log('main-a2: simple Promise: a2 =', result);

				// パラレル処理(並行処理) ... 配列やオブジェクトで結果を取得
				context$1$0.next = 11;
				return [sleep(2000, 'b1'), sleep(2000, 'b2')];

			case 11:
				result = context$1$0.sent;

				console.log('main-b: parallel Array:', result);
				context$1$0.next = 15;
				return { x: sleep(2000, 'c1'), y: sleep(2000, 'c2') };

			case 15:
				result = context$1$0.sent;

				console.log('main-c: parallel Object:', result);
				context$1$0.next = 19;
				return Promise.all([sleep(2000, 'd1'), sleep(2000, 'd2')]);

			case 19:
				result = context$1$0.sent;

				console.log('main-d: Promise.all([promises,...]): [d1, d2] =', result);

				// generatorのsub()をyieldで呼ぶ
				context$1$0.next = 23;
				return sub('e');

			case 23:
				result = context$1$0.sent;

				console.log('main-e: sub(e) =', result);

				// パラレル処理(並行処理) ... 配列やオブジェクトで結果を取得
				// generatorのsub()を並行処理で呼ぶ ... 配列
				context$1$0.next = 27;
				return [sub('f1'), sub('f2')];

			case 27:
				result = context$1$0.sent;

				console.log('main-f: [generators,...]: [d1, d2] =', result);
				// generatorのsub()を並行処理で呼ぶ ... オブジェクト
				context$1$0.next = 31;
				return { x: sub('g1'), y: sub('g2') };

			case 31:
				result = context$1$0.sent;

				console.log('main-g: {x:generator, y:...}: {x:g1, y:g2} =', result);

				// 必要ないけど無理やりgeneratorのsub()をpromiseにしてみた
				context$1$0.next = 35;
				return Promise.all([aa(sub('h1')), aa(sub('h2'))]);

			case 35:
				result = context$1$0.sent;

				console.log('main-f: Promise.all([aa(generator),...]): [h1, h2] =', result);

				return context$1$0.abrupt('return', 'return value!');

			case 38:
			case 'end':
				return context$1$0.stop();
		}
	}, marked0$0[0], this);
}

function sub(val) {
	return regeneratorRuntime.wrap(function sub$(context$1$0) {
		while (1) switch (context$1$0.prev = context$1$0.next) {
			case 0:
				context$1$0.next = 2;
				return sleep(1000, val + '-x1');

			case 2:
				console.log('sub-' + val + '-x1: simple Promise: ' + val + '-x1');

				context$1$0.next = 5;
				return sleep(1000, val + '-x2');

			case 5:
				console.log('sub-' + val + '-x2: simple Promise: ' + val + '-x2');

				return context$1$0.abrupt('return', val);

			case 7:
			case 'end':
				return context$1$0.stop();
		}
	}, marked0$0[1], this);
}

function sleep(msec, val) {
	return new Promise(function (resolve, reject) {
		setTimeout(resolve, msec, val);
	});
}


},{"aa":3}],3:[function(require,module,exports){
(function (process){
// aa.js - async-await.js

this.aa = function (PromiseThunk) {
	'use strict';

	var isPromise = PromiseThunk.isPromise;
	var promisify = PromiseThunk.promisify;

	// GeneratorFunction
	try {
		var GeneratorFunction = Function('return function*(){}.constructor')();
	} catch (e) {}

	// GeneratorFunctionPrototype
	try {
		var GeneratorFunctionPrototype = Function('return (function*(){})().constructor')();
	} catch (e) {}

	var slice = [].slice;

	// defProp
	var defProp = function (obj) {
		if (!Object.defineProperty) return null;
		try {
			Object.defineProperty(obj, 'prop', {value: 'str'});
			return obj.prop === 'str' ? Object.defineProperty : null;
		} catch (err) { return null; }
	} ({});

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


	// Queue
	function Queue() {
		this.tail = this.head = null;
	}
	Queue.prototype.push = function push(x) {
		if (this.tail)
			this.tail = this.tail[1] = [x, null];
		else
			this.tail = this.head = [x, null];
	};
	Queue.prototype.shift = function shift() {
		if (!this.head) return null;
		var x = this.head[0];
		this.head = this.head[1];
		if (!this.head) this.tail = null;
		return x;
	};


	// nextTickDo(fn)
	var nextTickDo = typeof setImmediate === 'function' ? setImmediate :
		typeof process === 'object' && process && typeof process.nextTick === 'function' ? process.nextTick :
		function nextTick(fn) { setTimeout(fn, 0); };

	var tasks = new Queue();

	var nextTickProgress = false;

	// nextTick(fn, ...args)
	function nextTick(fn) {
		if (typeof fn !== 'function')
			throw new TypeError('fn must be a function');

		tasks.push(arguments);
		if (nextTickProgress) return;

		nextTickProgress = true;

		nextTickDo(function () {
			var args;
			while (args = tasks.shift())
				args[0](args[1], args[2], args[3], args[4]);

			nextTickProgress = false;
		});
	}


	// aa - async-await
	function aa(gtor) {
		var ctx = this, args = slice.call(arguments, 1);

		// is generator function? then get generator.
		if (isGeneratorFunction(gtor))
			gtor = gtor.apply(ctx, args);

		// is promise? then do it.
		if (isPromise(gtor))
			return PromiseThunk(gtor);

		// is function? then promisify it.
		if (typeof gtor === 'function')
			return promisify.call(ctx, gtor);

		// is not generator?
		if (!isGenerator(gtor))
			return Channel.apply(ctx, arguments);

		var resolve, reject, p = PromiseThunk(
			function (res, rej) { resolve = res; reject = rej; });

		nextTick(callback);
		return p;

		function callback(err, val) {
			try {
				if (err) {
					if (typeof gtor['throw'] !== 'function')
						return reject(err);
					var ret = gtor['throw'](err);
				}
				else
					var ret = gtor.next(val);
			} catch (err) {
				return reject(err);
			}

			if (ret.done)
				return resolve(ret.value);

			nextTick(doValue, ret.value, callback, ctx, args);
		}

	}


	function doValue(value, callback, ctx, args) {
		if (value == null ||
				 typeof value !== 'object' &&
				 typeof value !== 'function')
			return callback(null, value);

		if (isGeneratorFunction(value))
			value = value.apply(ctx, args);

		if (isGenerator(value))
			return aa.call(ctx, value)(callback);

		// function must be a thunk
		if (typeof value === 'function')
			return value(callback);

		if (isPromise(value))
			return value.then(function (val) { callback(null, val); }, callback);

		var called = false;

		// array
		if (value instanceof Array) {
			var n = value.length;
			if (n === 0) return callback(null, []);
			var arr = Array(n);
			value.forEach(function (val, i) {
				doValue(val, function (err, val) {
					if (err) {
						if (!called)
							called = true, callback(err);
					}
					else {
						arr[i] = val;
						if (--n === 0 && !called)
							called = true, callback(null, arr);
					}
				});
			});
		} // array

		// object
		else if (value.constructor === Object) {
			var keys = Object.keys(value);
			var n = keys.length;
			if (n === 0) return callback(null, {});
			var obj = {};
			keys.forEach(function (key) {
				obj[key] = undefined;
				doValue(value[key], function (err, val) {
					if (err) {
						if (!called)
							called = true, callback(err);
					}
					else {
						obj[key] = val;
						if (--n === 0 && !called)
							called = true, callback(null, obj);
					}
				});
			});
		} // object

		// other value
		else
			return callback(null, value);
	}


	// isGeneratorFunction
	function isGeneratorFunction(gtor) {
		if (!gtor) return false;
		var ctor = gtor.constructor;
		return ctor === GeneratorFunction ||
			(ctor.displayName || ctor.name) === 'GeneratorFunction';
	}

	// isGenerator
	function isGenerator(gtor) {
		if (!gtor) return false;
		var ctor = gtor.constructor;
		return ctor === GeneratorFunctionPrototype ||
			(ctor.displayName || ctor.name) === 'GeneratorFunctionPrototype' ||
			typeof gtor.next === 'function';
	}


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


	function wait(ms) {
		return function (cb) {
			setTimeout(cb, ms);
		};
	};


	if (typeof module === 'object' && module && module.exports)
		module.exports = aa;

	if (GeneratorFunction)
		aa.GeneratorFunction = GeneratorFunction;

	aa.isGeneratorFunction = isGeneratorFunction;
	aa.isGenerator         = isGenerator;
	aa.aa                  = aa;
	aa.chan = aa.Channel   = Channel;
	aa.wait                = wait;

	if (Object.getOwnPropertyNames)
		Object.getOwnPropertyNames(PromiseThunk).forEach(function (prop) {
			if (!aa.hasOwnProperty(prop))
				setValue(aa, prop, PromiseThunk[prop]);
		});
	else
		for (var prop in PromiseThunk)
			if (!aa.hasOwnProperty(prop))
				setValue(aa, prop, PromiseThunk[prop]);

	return aa;

}(this.PromiseThunk || require('promise-thunk'));

}).call(this,require('_process'))
},{"_process":1,"promise-thunk":4}],4:[function(require,module,exports){
(function (process){
// promise-thunk.js

this.PromiseThunk = function () {
	'use strict';

	var STATE_UNRESOLVED = -1;
	var STATE_REJECTED = 0;
	var STATE_RESOLVED = 1;
	var STATE_THUNK = 2;

	var ARGS_ERR = 0;
	var ARGS_VAL = 1;

	var COLOR_OK     = typeof window !== 'undefined' ? '' : '\x1b[32m';
	var COLOR_ERROR  = typeof window !== 'undefined' ? '' : '\x1b[35m';
	var COLOR_NORMAL = typeof window !== 'undefined' ? '' : '\x1b[m';

	var slice = [].slice;

	// defProp
	var defProp = function (obj) {
		if (!Object.defineProperty) return null;
		try {
			Object.defineProperty(obj, 'prop', {value: 'str'});
			return obj.prop === 'str' ? Object.defineProperty : null;
		} catch (err) { return null; }
	} ({});

	// setConst(obj, prop, val)
	var setConst = defProp ?
		function setConst(obj, prop, val) {
			defProp(obj, prop, {value: val}); return val; } :
		function setConst(obj, prop, val) { return obj[prop] = val; };

	// setValue(obj, prop, val)
	var setValue = defProp ?
		function setValue(obj, prop, val) {
			defProp(obj, prop, {value: val,
				writable: true, configurable: true}); return val; } :
		function setValue(obj, prop, val) { return obj[prop] = val; };

	// getProto(obj)
	var getProto = Object.getPrototypeOf || {}.__proto__ ?
		function getProto(obj) { return obj.__proto__; } : null;

	// setProto(obj, proto)
	var setProto = Object.setPrototypeOf || {}.__proto__ ?
		function setProto(obj, proto) { obj.__proto__ = proto; } : null;

	// Queue
	function Queue() {
		this.tail = this.head = null;
	}
	// Queue#push(x)
	setValue(Queue.prototype, 'push', function push(x) {
		if (this.tail)
			this.tail = this.tail[1] = [x, null];
		else
			this.tail = this.head = [x, null];
		return this;
	});
	// Queue#shift()
	setValue(Queue.prototype, 'shift', function shift() {
		if (!this.head) return null;
		var x = this.head[0];
		this.head = this.head[1];
		if (!this.head) this.tail = null;
		return x;
	});

	// nextTickDo(fn)
	var nextTickDo = typeof setImmediate === 'function' ? setImmediate :
		typeof process === 'object' && process && typeof process.nextTick === 'function' ? process.nextTick :
		function nextTick(fn) { setTimeout(fn, 0); };

	var tasksHighPrio = new Queue();
	var tasksLowPrio = new Queue();

	var nextTickProgress = false;

	// nextTick(ctx, fn, fnLow)
	function nextTick(ctx, fn, fnLow) {
		if (typeof fn === 'function')
			tasksHighPrio.push({ctx:ctx, fn:fn});

		if (typeof fnLow === 'function')
			tasksLowPrio.push({ctx:ctx, fn:fnLow});

		if (nextTickProgress) return;

		nextTickProgress = true;

		nextTickDo(function () {
			var task;

			for (;;) {
				while (task = tasksHighPrio.shift())
					task.fn.call(task.ctx);

				if (task = tasksLowPrio.shift())
					task.fn.call(task.ctx);
				else break;
			}

			nextTickProgress = false;
		});
	}

	function PROMISE_RESOLVE() {}
	function PROMISE_REJECT() {}
	function PROMISE_THEN() {}

	// PromiseThunk(setup(resolve, reject))
	function PromiseThunk(setup, val) {
		if (setup && typeof setup.then === 'function')
			return $$convert(setup);

		$this.$callbacks = new Queue();
		$this.$state = STATE_UNRESOLVED;
		$this.$args = undefined;
		$this.$handled = false;

		if (setProto)
			setProto($this, PromiseThunk.prototype);
		else {
			if ($this.then     !== $$then)
					$this.then     =   $$then;
			if ($this['catch'] !== $$catch)
					$this['catch'] =   $$catch;
			if ($this.toString !== $$toString)
					$this.toString =   $$toString;
		}

		if (typeof setup === 'function') {
			if (setup === PROMISE_RESOLVE)
				$$resolve.call($this, val);
			else if (setup === PROMISE_REJECT)
				$$reject.call($this, val);
			else {
				// setup(resolve, reject)
				try {
					setup.call($this,
						function resolve(v) { return $$resolve.call($this, v); },
						function reject(e)  { return $$reject.call($this, e); });
				} catch (err) {
					$$reject.call($this, err);
				}
			}
		} // PromiseThunk

		// $this(cb) === thunk
		function $this(cb) {
			if (typeof cb !== 'function')
				cb = function () {};

			var p = PromiseThunk();
			$this.$callbacks.push([undefined, undefined,
				function (err, val) {
					try {
						$$resolve.call(p, err instanceof Error || arguments.length === cb.length ? cb.apply(this, arguments) :
							// normal node style callback
							cb.length === 2 ? cb.call(this, err, val) :
							// fs.exists like callback, arguments[0] is value
							cb.length === 1 ? cb.call(this, val) :
							// unknown callback
							cb.length === 0 ? cb.apply(this, arguments) :
							// child_process.exec like callback
							val instanceof Array ? cb.apply(this, [err].concat(val)) :
							cb.apply(this, arguments));
					} catch (e) {
						if (!err) return $$reject.call(p, e);
						console.error(COLOR_ERROR + 'Unhandled callback error: ' + err2str(e) + COLOR_NORMAL);
						$$reject.call(p, err);
					}
				}
			]);
			nextTick($this, $$fire);
			return p;
		}

		return $this;
	}

	// $$callback(err, val) or $callback(...$args)
	function $$callback() {
		if (this.$args) {
			var err = arguments[ARGS_ERR];
			if (err) {
				console.info(COLOR_OK + this + COLOR_NORMAL);
				console.error(COLOR_ERROR + 'Unhandled 2nd rejection ' + err2str(err) + COLOR_NORMAL);
			}
			return; // already fired
		}
		this.$args = arguments;
		this.$state = arguments[ARGS_ERR] ? STATE_REJECTED : STATE_RESOLVED;
		nextTick(this, $$fire);
	}

	// $$resolve(val)
	function $$resolve(val) {
		if (this.$args) return; // already resolved
		var $this = this;

		// val is promise?
		if (isPromise(val)) {
			val.then(
				function (v) { $$callback.call($this, null, v); },
				function (e) { $$callback.call($this, e); });
			return;
		}

		// val is function? must be thunk.
		if (typeof val === 'function') {
			val(function (e, v) { $$callback. call($this, e, v); });
			return;
		}

		$$callback.call($this, null, val);
	} // $$resolve

	// $$reject(err)
	var $$reject = $$callback;

	// $$fire()
	function $$fire() {
		var elem;
		var $args = this.$args;
		var $state = this.$state;
		var $callbacks = this.$callbacks;
		if (!$args) return; // not yet fired
		while (elem = $callbacks.shift()) {
			if (elem[STATE_THUNK]) {
				this.$handled = true;
				elem[STATE_THUNK].apply(null, $args);
			}
			else if (elem[$state]) {
				if ($state === STATE_REJECTED) this.$handled = true;
				elem[$state]($args[$state]);
			}
		}
		nextTick(this, null, $$checkUnhandledRejection);
	} // $$fire

	// $$checkUnhandledRejection()
	function $$checkUnhandledRejection() {
		var $args = this.$args;
		if (this.$state === STATE_REJECTED && !this.$handled) {
			console.info(COLOR_OK + this + COLOR_NORMAL);
			console.error(COLOR_ERROR + 'Unhandled rejection ' + err2str($args[ARGS_ERR]) + COLOR_NORMAL);
			// or throw $args[0];
			// or process.emit...
		}
	} // $$checkUnhandledRejection

	// PromiseThunk#then(res, rej)
	var $$then = then;
	setValue(PromiseThunk.prototype, 'then', then);
	function then(res, rej) {
		if (res && typeof res !== 'function')
			throw new TypeError('resolved must be a function');
		if (rej && typeof rej !== 'function')
			throw new TypeError('rejected must be a function');

		var p = PromiseThunk();
		this.$callbacks.push([
			function (err) {
				try { // then err
					if (rej) $$resolve.call(p, rej(err));
					else     $$reject.call(p, err);
				} catch (e) {
					$$reject.call(p, err);
					console.error(COLOR_ERROR + 'Unhandled callback error: ' + err2str(e) + COLOR_NORMAL);
					$$reject.call(p, e);
				}
			},
			function (val) {
				try { // then val
					if (res) $$resolve.call(p, res(val));
					else     $$resolve.call(p, val)
				} catch (e) {
					$$reject.call(p, e);
				}
			}
		]);
		nextTick(this, $$fire);
		return p;
	} // then

	// PromiseThunk#catch(rej)
	var $$catch = caught;
	setValue(PromiseThunk.prototype, 'catch', caught);
	function caught(rej) {
		if (typeof rej !== 'function')
			throw new TypeError('rejected must be a function');

		var p = PromiseThunk();
		this.$callbacks.push([
			function (err) {
				try { // catch err
					$$resolve.call(p, rej(err));
				} catch (e) {
					$$reject.call(p, err);
					console.log('\x1b[41m' + e + '\x1b[m');
				}
			}
		]);
		nextTick(this, $$fire);
		return p;
	} // catch

	// PromiseThunk#toString()
	setValue(PromiseThunk.prototype, 'toString', toString);
	var $$toString = toString;
	function toString() {
		return 'PromiseThunk { ' + (
			this.$state === STATE_UNRESOLVED ? '<pending>' :
			this.$state === STATE_RESOLVED ? JSON.stringify(this.$args[ARGS_VAL]) :
			'<rejected> ' + this.$args[ARGS_ERR]) + ' }';
	} // toString

	// PromiseThunk.promisify(fn)
	setValue(PromiseThunk, 'promisify', promisify);
	setValue(PromiseThunk, 'wrap',      promisify);
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
			return PromiseThunk(function (res, rej) {
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

	// PromiseThunk.thunkify(fn)
	setValue(PromiseThunk, 'thunkify',  thunkify);
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

	// PromiseThunk.promisifyAll(object, options)
	setValue(PromiseThunk, 'promisifyAll', function promisifyAll(object, options) {
		var keys = [];
		if (Object.getOwnPropertyNames) keys = Object.getOwnPropertyNames(object);
		else if (Object.keys) keys = Object.keys(object);
		else for (var method in object) if (object.hasOwnProperty(method)) keys.push(i);

		keys.forEach(function (method) {
			if (typeof object[method] === 'function' &&
					!object[method].promisified &&
					!object[method].thunkified)
				promisify(object, method, options);
		});
		return object;
	});

	// PromiseThunk.thunkifyAll(object, options)
	setValue(PromiseThunk, 'thunkifyAll', function thunkifyAll(object, options) {
		var keys = [];
		if (Object.getOwnPropertyNames) keys = Object.getOwnPropertyNames(object);
		else if (Object.keys) keys = Object.keys(object);
		else for (var method in object) if (object.hasOwnProperty(method)) keys.push(i);

		keys.forEach(function (method) {
			if (typeof object[method] === 'function' &&
					!object[method].promisified &&
					!object[method].thunkified)
				thunkify(object, method, options);
		});
		return object;
	});

	// PromiseThunk.resolve(val)
	setValue(PromiseThunk, 'resolve', function resolve(val) {
		return PromiseThunk(PROMISE_RESOLVE, val);
	});

	// PromiseThunk.reject(err)
	setValue(PromiseThunk, 'reject', function reject(err) {
		return PromiseThunk(PROMISE_REJECT, err);
	});

	// PromiseThunk.convert(promise or thunk)
	setValue(PromiseThunk, 'convert', function convert(promise) {
		if (isPromise(promise)) {
			var p = PromiseThunk();
			promise.then(
				function (v) { $$resolve.apply(p, arguments); },
				function (e) { $$reject.apply(p, arguments); });
			return p;
		}
		return PromiseThunk(PROMISE_RESOLVE, promise);
	});
	var $$convert = PromiseThunk.convert;

	// PromiseThunk.all([p, ...])
	setValue(PromiseThunk, 'all', all);
	function all(promises) {
		if (isIterator(promises)) promises = makeArrayFromIterator(promises);
		if (!(promises instanceof Array))
			throw new TypeError('promises must be an array');

		return PromiseThunk(
			function promiseAll(resolve, reject) {
				var n = promises.length;
				if (n === 0) return resolve([]);
				var res = Array(n);
				promises.forEach(function (p, i) {
					function complete(val) {
						res[i] = val; if (--n === 0) resolve(res); }
					function error(err) {
						if (n > 0) reject(err); n = 0; }
					if (p instanceof PromiseThunk || isPromise(p))
						return p.then(complete, error);
					complete(p);
				}); // promises.forEach
			}
		); // return PromiseThunk
	} // all

	// PromiseThunk.race([p, ...])
	setValue(PromiseThunk, 'race', race);
	function race(promises) {
		if (isIterator(promises)) promises = makeArrayFromIterator(promises);
		if (!(promises instanceof Array))
			throw new TypeError('promises must be an array');

		return PromiseThunk(
			function promiseRace(resolve, reject) {
				promises.forEach(function (p) {
					if (p instanceof PromiseThunk || isPromise(p))
						return p.then(resolve, reject);
					resolve(p);
				}); // promises.forEach
			}
		); // return PromiseThunk
	} // race

	// PromiseThunk.accept(val)
	setValue(PromiseThunk, 'accept', PromiseThunk.resolve);

	// PromiseThunk.defer()
	setValue(PromiseThunk, 'defer', defer);
	function defer() {
		var p = PromiseThunk();
		return {promise: p,
			resolve: function resolve() { $$resolve.apply(p, arguments); },
			reject:  function reject()  { $$reject.apply(p, arguments); }};
	}

	// isPromise(p)
	setValue(PromiseThunk, 'isPromise', isPromise);
	function isPromise(p) {
		return !!p && typeof p.then === 'function';
	}

	// isIterator(iter)
	setValue(PromiseThunk, 'isIterator', isIterator);
	function isIterator(iter) {
		return !!iter && (typeof iter.next === 'function' || isIterable(iter));
	}

	// isIterable(iter)
	setValue(PromiseThunk, 'isIterable', isIterable);
	function isIterable(iter) {
		return !!iter && typeof Symbol === 'function' &&
				!!Symbol.iterator && typeof iter[Symbol.iterator] === 'function';
	}

	// makeArrayFromIterator(iter or array)
	setValue(PromiseThunk, 'makeArrayFromIterator', makeArrayFromIterator);
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

	function err2str(err) {
		var msg = err.stack || (err + '');
		return msg.split('\n').filter(filterExcludeMocha).join('\n');
	}

	function filterExcludeMocha(s) {
		return !s.match(/node_modules.*mocha/);
	}

	if (typeof module === 'object' && module && module.exports)
		module.exports = PromiseThunk;

	setValue(PromiseThunk, 'PromiseThunk', PromiseThunk);
	setValue(PromiseThunk, 'Promise',      PromiseThunk);
	return PromiseThunk;

}();

}).call(this,require('_process'))
},{"_process":1}]},{},[2]);
