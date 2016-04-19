void function () {
	'use strict';

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
			callbacks.forEach(cb => cb.apply(ctx, results));
		}

		thunk.callback = callback;
		return thunk;
	}

	function someProc(msec) {
		var thunk = Thunk(this, arguments);
		setTimeout(thunk.callback, msec);
		return thunk;
	}

	someProc(100, function () { console.log('100'); });
	someProc(200)(function () { console.log('200'); });

}();
