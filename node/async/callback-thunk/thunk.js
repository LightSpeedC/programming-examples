void function () {
	'use strict';

	module.exports = Thunk;

	const slice = [].slice;

	function Thunk(ctx, args) {
		if (!args) args = [];
		var callbacks = [], results, next;

		if (typeof args[args.length - 1] === 'function')
			callbacks.push(args[args.length - 1]);

		function thunk(cb) {
			callbacks.push(cb);
			next = Thunk(ctx);
			if (results) cb.apply(ctx, results);
			return next;
		}

		function callback(error, value) {
			results = arguments;
			callbacks.forEach(cb => {
				var val;
				try {
				if (results.length === 1) {
					if (results[0] == null || !(results[0] instanceof Error))
						val = cb.call(ctx, null, results[0]);
					else
						val = cb.call(ctx, results[0]);
				}
				else if (cb.length >= results.length || cb.length === 0)
					val = cb.apply(ctx, results);
				else if (cb.length === 1) {
					if (results[0] == null) {
						if (results.length === 2)
							val = cb.call(ctx, results[1]);
						else if (results.length === 1)
							val = cb.call(ctx, results[0]);
						else
							val = cb.call(ctx, slice.call(results, 1));
					}
					else
						val = cb.apply(ctx, results);
				}
				else
					val = cb.apply(ctx, slice.call(results, 0, cb.length - 1)
						.concat([slice.call(results, cb.length - 1)]));
				} catch (err) { val = err; }
				if (next) {
					if (val == null)
						return next.callback(null, val);
					switch (typeof val) {
						case 'function':
							return val(next.callback);
						case 'object':
							if (typeof val.then === 'function')
								return val.then(next.callback, next.callback);
							if (val instanceof Error)
								return next.callback(val);
						default:
							return next.callback(null, val);
					}
				}
			});
		}

		thunk.callback = callback;
		return thunk;
	}

}();
