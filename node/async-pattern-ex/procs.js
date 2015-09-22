(function () {
	'use strict';

	// 処理A
	function procA(arg, cb) {
		return timer(200, arg, cb);
	}

	// 処理B
	function procB(arg, cb) {
		return timer(100, arg, cb);
	}

	// 処理C
	function procC(arg, cb) {
		return timer(150, arg, cb);
	}

	// 処理X
	function procX(arg, cb) {
		return timer(120 + Math.random() * 60, arg, cb);
	}

	// 異常時エラー表示
	function error(msg, err) {
		if (typeof window === 'undefined')
			console.error('\x1b[1;31m' + msg, err, '\x1b[m');
		else
			console.error(msg, err);
	}

	// 正常時情報表示
	function info(msg, val) {
		if (typeof window === 'undefined')
			console.info('\x1b[1;32m' + msg, val, '\x1b[m');
		else
			console.info(msg, val);
	}

	// タイマー
	function timer(ms, arg, cb) {
		console.log('start', arg);
		setTimeout(function () {
			var err = null;
			if (Math.random() < 0.1)
				err = new Error('random error ' + arg);

			if (err) {
				error('end  ', err);
				cb(err);
			}
			else {
				console.info('end  ', arg);
				cb(null, arg);
			}
		}, ms);
	}

	// インターバル
	function interval(ms, arg, cb) {
		console.log('start', arg);
		return setInterval(function () {
			var err = null;
			if (Math.random() < 0.1)
				err = new Error('random error ' + arg);

			if (err) {
				error('fire ', err);
				cb(err);
			}
			else {
				console.info('fire ', arg);
				cb(null, arg);
			}
		}, ms);
	}

	exports.timer = timer;
	exports.procA = procA;
	exports.procB = procB;
	exports.procC = procC;
	exports.procX = procX;
	exports.error = error;
	exports.info  = info;
	exports.interval = interval;

})();
