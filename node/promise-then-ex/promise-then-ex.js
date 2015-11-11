(function (Promise) {
	'use strict';

	if (!Promise) Promise = PromiseCore;

	var STATE_UNKNOWN = -1;
	var STATE_REJECTED = 0;
	var STATE_RESOLVED = 1;

	var COLORS = {red: '31', green: '32', purple: '35', cyan: '36'};
	var colors = Object.keys(COLORS).reduce((obj, k) => {
		obj[k] = typeof window === 'object' ? x => x :
			x => '\x1b[' + COLORS[k] + 'm' + x + '\x1b[m';
		return obj;
	}, {});

	var proto = PromiseCore.prototype;
	function PromiseCore(setup) {
		/*
		function $this(callback) {
			var p = new PromiseCore();
			$this.$callbacks.push([null, null, callback, p]);
			if ($this.$state !== STATE_UNKNOWN) this.$next();
			return p;
		};
		*/
		var $this = this;

		Object.defineProperties($this, {
			'$state': {writable: true, configurable: true, value: STATE_UNKNOWN},
			'$result': {writable: true, configurable: true, value: undefined},
			'$callbacks': {writable: true, configurable: true, value: []}
		});

		// $this.$state = STATE_UNKNOWN;
		// $this.$result = undefined;
		// $this.$callbacks = [];

		if (setup) setup((v) => $this.$resolve(v), (e) => $this.$reject(e));

		if (this.constructor.prototype !== proto) {
			if (Object.setPrototypeOf) Object.setPrototypeOf($this, proto);
			else $this.__proto__ = proto;

			if ($this.then !== proto.then)
				for (var p in proto)
					Object.defineProperty($this, p, {writable: true, configurable: true, value: proto[p]});
					// $this[p] = proto[p];
		}

		return $this;
	}

	// then
	proto.then = function then(resolved, rejected) {
		var p = new PromiseCore();
		this.$callbacks.push([rejected, resolved, null, p]);
		if (this.$state !== STATE_UNKNOWN) this.$next();
		return p;
	};

	// catch
	proto['catch'] = function caught(rejected) {
		var p = new PromiseCore();
		this.$callbacks.push([rejected, null, null, p]);
		if (this.$state !== STATE_UNKNOWN) this.$next();
		return p;
	};

	// resolve
	proto.$resolve = function resolve(val) {
		if (this.$state !== STATE_UNKNOWN) return;
		this.$state = STATE_RESOLVED;
		this.$result = val;
		this.$next();
	};

	// reject
	proto.$reject = function reject(err) {
		if (this.$state === STATE_RESOLVED) return;
		if (this.$state === STATE_REJECTED) return console.error(colors.purple('rejected twice: ' + this + ': ' + err));
		//if (this.$state !== STATE_UNKNOWN) return; // TODO
		this.$state = STATE_REJECTED;
		this.$result = err;
		this.$next();
	};

	// fire
	proto.$fire = function fire() {
		if (this.$state === STATE_UNKNOWN) return;
		var $this = this;
		var state = this.$state;
		var callbacks = this.$callbacks;
		this.$callbacks = [];
		callbacks.forEach((callback) => {
			try {
				var p = callback[3], r = undefined;
				if (callback[state])
					$this.proc = true, r = callback[state].call(null, this.$result);
				if (callback[2])
					$this.proc = true, r = callback[2].apply(null,
						state === STATE_RESOLVED ?
							[null, this.$result] : [this.$result]);
				if (r && r.then)
					r.then((v) => p.$resolve(v), (e) => p.$reject(e));
				else if (typeof r === 'function')
					r((e, v) => e ? p.$reject(e) : p.$resolve(v));
				else
					p.$resolve(r);
			} catch (e) {
				try {
					p.$reject(e);
				}
				catch (e2) {
					console.error(colors.purple('error in handler: ' + this + ': ' + e + ': ' + e2));
				}
			}
		});
		if (this.$state === STATE_REJECTED) setImmediate(() => this.$check());
	};

	// check
	proto.$check = function check() {
		if (!this.proc) console.error(colors.purple('unhandled rejection: ' + this));
		//if (this.$state === STATE_UNKNOWN) return;
	};

	// next
	proto.$next = function next() {
		if (this.$state === STATE_UNKNOWN) return;
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
		if (this.$state === STATE_REJECTED) obj.error = ''+this.$result;
		return obj;
	}

	// resolve
	PromiseCore.resolve = function resolve(val) {
		var p = new PromiseCore();
		p.$resolve(val);
		return p;
	};

	// resolve
	PromiseCore.reject = function reject(err) {
		var p = new PromiseCore();
		p.$reject(err);
		return p;
	};

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
	.then((v) => {console.log(v); throw new Error('xxx'); return sleep(1000, 'b'); })
	.then((v) => {console.log(v); return sleep(1000, 'c'); })
	.then(console.log)
	.catch((e) => console.log('catch all: ' + e));

	console.log(sleep(1000, 'a'));
	console.log('%s', sleep(1000, 'a'));
	console.log('%j', sleep(1000, 'a'));
	console.log('%s', PromiseCore.resolve(1));
	console.log('%j', PromiseCore.resolve(1));
	console.log('%s', PromiseCore.reject(new Error('yyy')));
	console.log('%j', PromiseCore.reject(new Error('zzz')));
	console.log('prototype?', PromiseCore.resolve(1).constructor.prototype);

})(typeof Promise === 'function' ? Promise : null);
