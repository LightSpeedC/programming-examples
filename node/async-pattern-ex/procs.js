(function () {
	'use strict';

	var Promise = require('promise-light');
	// var Promise = require('promise-thunk');

	function timer(ms, arg, cb) {
		if (typeof cb === 'function')
			return setup();
		else
			return new Promise(setup);

		function setup(resolve, reject) {
			console.log('start', arg);
			setTimeout(function () {
				console.log('end  ', arg);

				var err = null;
				if (Math.random() < 0.1)
					err = new Error('random error ' + arg);

				if (typeof cb === 'function')
					!err ? cb(null, arg) : cb(err);
				else
					!err ? resolve(arg) : reject(err);
			}, ms);
		}
	}

	function procA(arg, cb) {
		return timer(200, arg, cb);
	}

	function procB(arg, cb) {
		return timer(100, arg, cb);
	}

	function procC(arg, cb) {
		return timer(150, arg, cb);
	}

	function procX(arg, cb) {
		return timer(120 + Math.random() * 60, arg, cb);
	}

	function error(msg, err) {
		if (typeof window === 'undefined')
			console.error('\x1b[1;31m' + msg, err, '\x1b[m');
		else
			console.error(msg, err);
	}

	function info(msg, val) {
		if (typeof window === 'undefined')
			console.info('\x1b[1;32m' + msg, val, '\x1b[m');
		else
			console.info(msg, err);
	}

	exports.timer = timer;
	exports.procA = procA;
	exports.procB = procB;
	exports.procC = procC;
	exports.procX = procX;
	exports.error = error;
	exports.info = info;

})();
