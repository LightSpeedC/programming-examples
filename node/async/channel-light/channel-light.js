void function () {
	'use strict';

	var push = Array.prototype.push;

	// Channel
	function Channel() {
		var values = [], callbacks = Array.apply(null, arguments);
		return function channel(first) {
			if (typeof first === 'function')
				push.apply(callbacks, arguments);
			else if (first && typeof first.then === 'function')
				return first.then(channel, channel), channel;
			else {
				var args = arguments.length === 1 ? [first] : Array.apply(null, arguments);
				if (!(first == null || first instanceof Error)) args.unshift(null);
				values.push(args.length > 2 ? [args.shift(), args] : args);
			}
			while (callbacks.length && values.length)
				try { callbacks.shift().apply(channel, values.shift()); }
				catch (err) { values.unshift([err]); }
			return channel;
		};
	}

	if (typeof module === 'object' && module && module.exports)
		module.exports = Channel;

	if (typeof window === 'object' && window)
		window['channel-light'] = window.Channel = Channel;

}();
