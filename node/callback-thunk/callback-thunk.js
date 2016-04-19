void function () {
	'use strict';

	function Thunk(args) {
		var callbacks = [], called, error, value;

		if (typeof args[args.length - 1] === 'function')
			callbacks.push(args[args.length - 1]);

		function thunk(cb) {
			callbacks.push(cb);
			if (called) cb(error, value);
		}

		function callback(err, val) {
			called = true;
			error = err;
			value = val;
			callbacks.forEach(cb => cb(error, value));
		}

		thunk.callback = callback;
		return thunk;
	}

	function someProc(msec) {
		var thunk = new Thunk(arguments);
		setTimeout(thunk.callback, msec);
		return thunk;
	}

	someProc(100, function () { console.log('100'); });
	someProc(200)(function () { console.log('200'); });

}();
