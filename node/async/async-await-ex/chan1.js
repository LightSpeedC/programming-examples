void function () {
	'use strict';

	var push = [].push;
	var slice = [].slice;

	// Channel
	function Channel() {
		var values = [], callbacks = slice.call(arguments);
		var chan = normalcb(channel);
		return chan;
		function channel(err, val) {
			if (typeof val === 'function')
				callbacks.push(val);
			else if (val && typeof val[0] === 'function')
				push.apply(callbacks, val);
			else if (val && typeof val.then === 'function')
				return val.then(chan, chan), chan;
			else
				values.push(arguments);
			while (callbacks.length && values.length)
				try { callbacks.shift().apply(chan, values.shift()); }
				catch (err) { values.unshift([err]); }
			return chan;
		}
	}

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
	function normalcb(cb) {
		return function (err, val) {
			if (err != null)
				if (err instanceof Error) cb.apply(this, arguments);
				else cb.call(this, null, slices0[arguments.length](arguments));
			else cb.call(this, null, slices1[arguments.length](arguments));
			return this;
		};
	} // normalcb

	if (typeof module === 'object' && module && module.exports)
		module.exports = Channel;

	if (typeof window === 'object' && window)
		window['channel-light'] = window.Channel = Channel;

}();
