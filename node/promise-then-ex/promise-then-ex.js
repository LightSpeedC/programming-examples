(function (Promise) {
	'use strict';

	if (!Promise) Promise = PromiseCore;

	var STATE_UNRESOLVED = -1;
	var STATE_REJECTED = 0;
	var STATE_RESOLVED = 1;
	var ARGS_CALLBACK = 2;
	var ARGS_PROMISE = 3;

	var COLORS = {red: '31', green: '32', purple: '35', cyan: '36'};
	var colors = Object.keys(COLORS).reduce((obj, k) => {
		obj[k] = typeof window === 'object' ? x => x :
			x => '\x1b[' + COLORS[k] + 'm' + x + '\x1b[m';
		return obj;
	}, {});

	// setProto
	var setProto = typeof Object.setPrototypeOf === 'function' ?
		Object.setPrototypeOf : (obj, proto) => obj.__proto__ = proto;

	// proto
	var proto = PromiseCore.prototype;

	// PromiseCore
	function PromiseCore(setup) {

		var $this = (callback) => $this.$addCallbacks(null, null, callback);

		// var $this = this;

		Object.defineProperties($this, {
			'$state': {writable: true, configurable: true, value: STATE_UNRESOLVED},
			'$result': {writable: true, configurable: true, value: undefined},
			'$callbacks': {writable: true, configurable: true, value: []},
			'$handled': {writable: true, configurable: true, value: false}
		});

		// $this.$state = STATE_UNRESOLVED;
		// $this.$result = undefined;
		// $this.$callbacks = [];
		// $this.$handled = false;

		if (!($this instanceof PromiseCore)) {
			setProto($this, proto);

			if ($this.then !== proto.then)
				Object.getOwnPropertyNames(proto).forEach(p =>
					Object.defineProperty($this, p, {configurable: true, value: proto[p]}));
		}

		if (typeof setup === 'function')
			setup((v) => $this.$resolve(v), (e) => $this.$reject(e));

		return $this;
	}

	// then
	proto.then = function then(resolved, rejected) {
		return this.$addCallbacks(rejected, resolved, null);
	};

	// catch
	proto['catch'] = function caught(rejected) {
		return this.$addCallbacks(rejected, null, null);
	};

	// addCallbacks
	proto.$addCallbacks = function addCallbacks(rejected, resolved, callback) {
		var p = new PromiseCore();
		arguments[arguments.length++] = p;
		this.$callbacks.push(arguments);
		if (this.$state !== STATE_UNRESOLVED) this.$next();
		return p;
	};

	// resolve
	proto.$resolve = function resolve(val) {
		if (this.$state !== STATE_UNRESOLVED) return;
		if (isPromise(val))
			return val.then(
				(v) => {
					this.$state = STATE_RESOLVED;
					this.$result = v;
					this.$next();
				},
				(e) => {
					this.$reject(e);
				}), undefined;

		this.$state = STATE_RESOLVED;
		this.$result = val;
		this.$next();
	};

	// reject
	proto.$reject = function reject(err) {
		if (this.$state === STATE_RESOLVED)
			return console.error(colors.purple('resolved promise rejected: ' + this + ': ' + err));
		if (this.$state === STATE_REJECTED)
			return console.error(colors.purple('rejected twice: ' + this + ': ' + err));

		this.$state = STATE_REJECTED;
		this.$result = err;
		this.$next();
	};

	// fire
	proto.$fire = function fire() {
		if (this.$state === STATE_UNRESOLVED) return;
		var $this = this;
		var state = this.$state;
		var callbacks = this.$callbacks;
		this.$callbacks = [];
		callbacks.forEach((callback) => {
			try {
				var p = callback[ARGS_PROMISE], r;
				var s = callback[state];
				var cb = callback[ARGS_CALLBACK];

				$this.$handled = true;

				if (s)
					r = s.call(null, this.$result);
				else if (cb)
					r = cb.apply(null,
						state === STATE_RESOLVED ?
							[null, this.$result] : [this.$result]);
				else if (state === STATE_REJECTED)
					return p.$reject(this.$result);
				else
					return p.$resolve();

				if (typeof r === 'function')
					r((e, v) => e ? p.$reject(e) : p.$resolve(v));
				else
					p.$resolve(r);
			} catch (e) {
				try {
					p.$reject(e);
				}
				catch (e2) {
					console.error(colors.purple('error in handler: ' + this + ': ' + e.stack + '\n' + e2.stack));
				}
			}
		});
		if (!this.$handled && this.$state === STATE_REJECTED)
			setImmediate(() => this.$check());
	};

	// check
	proto.$check = function check() {
		if (!this.$handled) console.error(colors.purple('unhandled rejection: ' + this));
	};

	// next
	proto.$next = function next() {
		if (this.$state === STATE_UNRESOLVED) return;
		setImmediate(() => this.$fire());
	};

	// toString
	proto.toString = function toString() {
		return colors.cyan('PromiseCore ' + (
			this.$state === STATE_RESOLVED ? colors.green('<resolved ' + this.$result + '>'):
			this.$state === STATE_REJECTED ? colors.red('<rejected ' + this.$result + '>'):
			'<pending>'));
	}

	// toJSON
	proto.toJSON = function toJSON() {
		var obj = {'class': 'PromiseCore'};
		obj.state = ['pending', 'rejected', 'resolved'][this.$state + 1];
		if (this.$state === STATE_RESOLVED) obj.value = this.$result;
		if (this.$state === STATE_REJECTED) obj.error = '' + this.$result;
		return obj;
	}

	// resolve
	PromiseCore.resolve = (val) => new PromiseCore((res, rej) => res(val));

	// resolve
	PromiseCore.reject = (err) => new PromiseCore((res, rej) => rej(err));

	// isPromise
	function isPromise(p) {
		return !!p && typeof p.then === 'function';
	}

	for (var p in proto) {
		var v = proto[p];
		delete proto[p];
		Object.defineProperty(proto, p, {configurable: true, value: v});
	}

	// sleep
	function sleep(ms, val) {
		return new PromiseCore(function (resolve, reject) {
			setTimeout(resolve, ms, val);
		});
	}

	sleep(1000, 'a')
	.then((v) => {console.log(v); return sleep(1000, 'b'); })
	.then((v) => {console.log(v); throw new Error('xxx'); return sleep(1000, 'c'); })
	.then(console.log)
	.catch((e) => console.log('catch all: ' + e));

	console.log(sleep(1000, 'a'));
	console.log('pending: %s', sleep(1000, 'a'));
	console.log('pending: %j', sleep(1000, 'a'));
	console.log('resolve: %s', PromiseCore.resolve(1));
	console.log('resolve: %j', PromiseCore.resolve(1));
	console.log('reject: %s', PromiseCore.reject(new Error('yyy')));
	console.log('reject: %j', PromiseCore.reject(new Error('zzz')));
	console.log('prototype? %s', PromiseCore.resolve(1).constructor.prototype);
	console.log('prototype? %j', PromiseCore.resolve(1).constructor.prototype);
	console.log('prototype?', PromiseCore.resolve(1).constructor.prototype);

})(typeof Promise === 'function' ? Promise : null);
