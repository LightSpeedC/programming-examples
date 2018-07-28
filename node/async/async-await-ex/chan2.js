void function () {
	'use strict';

	var push = [].push;
	var slice = [].slice;

	// Channel()
	// recv: chan(cb)
	// send: chan(err, val)
	// send: chan() or chan(undefined)
	// send: chan(val)
	// chan.end()
	// chan.done()
	// chan.stream(reader)

	// Channel
	function Channel() {
		var values = [], callbacks = slice.call(arguments);
		var isClosed = false, isDone = false;
		var chan = normalcb(channel);

		chan.stream = stream;
		function stream(reader) {
			reader.on('end',      end);
			reader.on('error',    chan);
			reader.on('readable', readable);
			return chan;
			function readable() {
				var buf = reader.read();
				if (!buf) return;
				chan(null, buf);
			} // readable
		} // stream

		chan.end = chan.close = end;
		function end() {
			isClosed = true;
			return done();
		} // end

		chan.done = done;
		function done() {
			if (!isDone && isClosed && !values.length) {
				isDone = true;
				// complete each pending callback with the undefined value
				while (callbacks.length)
					try { callbacks.shift().call(chan); }
					catch (err) { values.unshift([err]); }
			}
			return isDone;
		} // done

		return chan;
		function channel(err, val) {
			if (typeof val === 'function')
				callbacks.push(val);
			else if (val && typeof val[0] === 'function')
				push.apply(callbacks, val);
			else if (val && typeof val.then === 'function')
				return val.then(chan, chan), chan;
			else if (isClosed)
				throw new Error('Cannot send to closed channel');
			else
				values.push(arguments);
			while (callbacks.length) {
				while (callbacks.length && values.length)
					try { callbacks.shift().apply(chan, values.shift()); }
					catch (err) { values.unshift([err]); }
				if (isClosed && callbacks.length)
					try { callbacks.shift().call(chan); }
					catch (err) { values.unshift([err]); }
				else break;
			}
			return chan;
		} // channel
	} // Channel

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
