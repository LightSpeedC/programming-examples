void function () {
	'use strict';

	function Thunk(args) {
		this.callbacks = [];
	}

	function someProc(msec) {
		//const thunk = new Thunk(arguments);
		const callbacks = [];
		var error, value, called;
		if (typeof arguments[arguments.length - 1] === 'function')
			callbacks.push(arguments[arguments.length - 1]);

		setTimeout(function () { callback(); }, msec);

		return function (cb) {
			callbacks.push(cb);
			if (error || value)
				callback(error, value);
		};

		function callback(err, val) {
			called = true;
			error = err;
			value = val;
			callbacks.forEach(cb => cb(error, value));
		}
	}

	someProc(100, function () { console.log('100'); });
	someProc(200)(function () { console.log('200'); });

}();
