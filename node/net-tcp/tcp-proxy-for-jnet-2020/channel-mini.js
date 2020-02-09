// channel-mini.js @ts-check

'use strict';

module.exports = Channel;
Channel['default'] = Channel;

var slice = [].slice;

/**
 * Channel
 * @param {function} thunk Setup function (res, rej) => void
 * @returns {function | Promise} Callback function | Promise
 */
function Channel(thunk) {
	var cbs = [], vals = [];

	channel.then = function then(res, rej) {
		return channel(function (err, val) {
			return err ? rej && rej(err) : res && res(val);
		});
	};

	thunk && thunk(channel);

	return channel;

	/**
	 * channel
	 * @param {...any} first Callback function | Node.js standard error and value
	 * @returns {function | Promise} Callback function | Promise
	 */
	function channel(first) {
		var args = slice.call(arguments), n = args.length;

		typeof first === 'function' ? cbs.push(first) :
			vals.push(n === 1 ? first instanceof Error ?
					[first, undefined] : [undefined, first] :
				n <= 2 ? args : [args.shift(), args]);

		while (cbs.length && vals.length) {
			try {
				cbs.shift().apply(undefined, vals.shift());
			}
			catch (err) {
				if (cbs.length === 0) {
					console.error(new Date().toLocaleString(),
						'channel-mini callback:', err);
				}
				vals.unshift([err, undefined]);
			}
		}

		return channel;
	}
}
