'use strict';

module.exports = Channel;

function Channel() {
	const callbacks = [], values = [];
	channel.then = then;
	return channel;

	function channel(first) {
		if (typeof first === 'function') callbacks.push(first);
		else values.push(arguments);
		while (callbacks.length > 0 && values.length > 0) {
			try { callbacks.shift().apply(null, values.shift()); }
			catch (error) { values.push([error]); }
		}
		return channel;
	}
}


function then(resolved, rejected) {
	return this(function (error, value) {
		if (error) rejected && rejected(error);
		else resolved && resolved(value);
	});
}
