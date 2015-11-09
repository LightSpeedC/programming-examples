(function (Promise) {
	'use strict';

	if (!Promise) Promise = PromiseCore;

	var STATE_UNKNOWN = -1;
	var STATE_REJECTED = 0;
	var STATE_RESOLVED = 1;

	var COLORS = {red: '31;1'};
	var colors = Object.keys(COLORS).reduce((obj, k) => {
		obj[k] = typeof window === 'object' ? x => x :
		else obj[k] = x => '\x1b[' + COLORS[k] + 'm' + x + '\x1b[m';
		return obj;
	}, {});
	console.log(colors.red('OK?'));

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
			'$result': {writable: true, configurable: true, value: []},
			'$callbacks': {writable: true, configurable: true, value: []}
		});

		// $this.$state = STATE_UNKNOWN;
		// $this.$result = [];
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
	proto.then = function then(resolved, rejected) {
		var p = new PromiseCore();
		this.$callbacks.push([rejected, resolved, null, p]);
		if (this.$state !== STATE_UNKNOWN) this.$next();
		return p;
	};
	proto['catch'] = function caught(rejected) {
		var p = new PromiseCore();
		this.$callbacks.push([rejected, null, null, p]);
		if (this.$state !== STATE_UNKNOWN) this.$next();
		return p;
	};
	proto.$resolve = function resolve(val) {
		if (this.$state !== STATE_UNKNOWN) return;
		this.$state = STATE_RESOLVED;
		this.$result = [null, val];
		this.$next();
	};
	proto.$reject = function reject(err) {
		if (this.$state === STATE_RESOLVED) return;
		if (this.$state === STATE_REJECTED) return console.error('rejected twice: ' + this + ': ' + err);
		//if (this.$state !== STATE_UNKNOWN) return; // TODO
		this.$state = STATE_REJECTED;
		this.$result = [err];
		this.$next();
	};
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
					r = callback[state].call(null, this.$result[state]), $this.proc = true;
				if (callback[2])
					r = callback[2].apply(null, this.$result), $this.proc = true;
				if (r && r.then)
					r.then((v)=>p.$resolve(v), (e)=>p.$reject(e));
				else if (typeof r === 'function')
					r((e,v)=>e?p.$reject(e):p.$resolve(v));
				else
					p.$resolve(r);
			} catch (e) {
				try {
					p.$reject(e);
				}
				catch (e2) {
					console.error('error in handler: ' + this + ': ' + e + ': ' + e2);
				}
			}
		});
		if (this.$state === STATE_REJECTED) setImmediate(() => this.$check());
	};
	proto.$check = function check() {
		if (!this.proc) console.error('unhandled rejection: ' + this);
		//if (this.$state === STATE_UNKNOWN) return;
	};
	proto.$next = function next() {
		if (this.$state === STATE_UNKNOWN) return;
		setImmediate(() => this.$fire());
	};
	proto.toString = function toString() {
		return 'PromiseCore <' + (
			this.$state === STATE_RESOLVED ? 'resolved ' + this.$result[this.$state] :
			this.$state === STATE_REJECTED ? 'rejected ' + this.$result[this.$state] :
			'pending') + '>';
	}
	proto.toJSON = function toJSON() {
		var obj = {'class': 'PromiseCore'};
		obj.state = ['pending', 'rejected', 'resolved'][this.$state + 1];
		if (this.$state === STATE_RESOLVED) obj.value = this.$result[this.$state];
		if (this.$state === STATE_REJECTED) obj.error = ''+this.$result[this.$state];
		return obj;
	}
	PromiseCore.resolve = function resolve(val) {
		var p = new PromiseCore();
		p.$resolve(val);
		return p;
	};
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

	function sleep(ms, val) {
		return new PromiseCore(function (resolve, reject) {
			setTimeout(resolve, ms, val);
		});
	}

	sleep(1000, 'a')
	.then((v) => {console.log(v); throw new Error('xxx'); return sleep(1000, 'b'); })
	.then((v) => {console.log(v); return sleep(1000, 'c'); })
	.then(console.log);

	console.log(sleep(1000, 'a'));
	console.log('%s', sleep(1000, 'a'));
	console.log('%j', sleep(1000, 'a'));
	console.log('%s', PromiseCore.resolve(1));
	console.log('%j', PromiseCore.resolve(1));
	console.log('%s', PromiseCore.reject(new Error('yyy')));
	console.log('%j', PromiseCore.reject(new Error('zzz')));
	console.log('xx?', PromiseCore.resolve(1).constructor.prototype);

})(typeof Promise === 'function' ? Promise : null);
