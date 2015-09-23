// lib.js

this.lib = function () {
	'use strict';

	var w = typeof window !== 'undefined';

	var lib = {};

	// 処理
	function procA(arg, cb) { return timer(200, arg, cb); }
	function procB(arg, cb) { return timer(100, arg, cb); }
	function procC(arg, cb) { return timer(150, arg, cb); }
	function procX(arg, cb) { return timer(120 + Math.random() * 60, arg, cb); }

	// エラー表示
	function error(msg, err) {
		if (w) console.error(msg, err);
		else   console.error('\x1b[1;31m' + msg, err, '\x1b[m');
	}

	// 情報表示
	function info(msg, val) {
		if (w) console.info(msg, val);
		else   console.info('\x1b[1;32m' + msg, val, '\x1b[m');
	}

	// ログ表示
	function log(msg, val) {
		if (w) console.log(msg, val);
		else   console.log('\x1b[1;36m' + msg, val, '\x1b[m');
	}

	// タイマー
	function timer(ms, arg, cb) {
		console.log('start', arg);
		setTimeout(function () {
			var err = null;
			if (Math.random() < 0.05)
				err = new Error('random error ' + arg);

			if (!err) {
				console.log('end  ', arg);
				cb(null, arg);
			}
			else {
				error('end  ', err);
				cb(err);
			}
		}, ms);
	}

	// インターバル
	function interval(ms, arg, cb) {
		console.log('start', arg);
		return setInterval(function () {
			var err = null;
			if (Math.random() < 0.05)
				err = new Error('random error ' + arg);

			if (!err) {
				console.log('fire ', arg);
				cb(null, arg);
			}
			else {
				error('fire ', err);
				cb(err);
			}
		}, ms);
	}

	lib.timer = timer;
	lib.procA = procA;
	lib.procB = procB;
	lib.procC = procC;
	lib.procD = procA;
	lib.procE = procB;
	lib.procF = procC;
	lib.procG = procA;
	lib.procH = procA;
	lib.procI = procB;
	lib.procJ = procC;
	lib.procK = procA;
	lib.procL = procB;
	lib.procM = procC;
	lib.procX = procX;
	lib.procY = procX;
	lib.error = error;
	lib.info  = info;
	lib.log   = log;
	lib.interval = interval;

	return lib;
}(this);
