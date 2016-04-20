void function () {
	'use strict';

	module.exports = Thunk;

	const slice = [].slice;

	function Thunk(ctx, args) {
		var callbacks = [], results;

		if (typeof args[args.length - 1] === 'function')
			callbacks.push(args[args.length - 1]);

		function thunk(cb) {
			callbacks.push(cb);
			if (results) cb.apply(ctx, results);
		}

		function callback() {
			results = arguments;
			callbacks.forEach(cb => {
				if (cb.length >= results.length)
					cb.apply(ctx, results)
				else
					cb.apply(ctx, slice.call(results, 0, cb.length - 1)
						.concat([slice.call(results, cb.length - 1)]));
			});
		}

		thunk.callback = callback;
		return thunk;
	}

}();
