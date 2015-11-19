void function () {
	'use strict';

	// Channel: チャネル
	function Channel() {
		var recvs = [].slice.call(arguments), sends = [];
		return function channel(func) {
			if (typeof func === 'function')
				for (var i = 0; i < arguments.length; ++i) {
					if (typeof arguments[i] !== 'function')
						throw new TypeError('arguments must be a function!');
					var args = sends.shift();
					if (args) arguments[i].apply(channel, args);
					else recvs.push(arguments[i]);
				}
			else if (func && typeof func.then === 'function')
				func.then(channel, channel);
			else {
				var args = [].slice.call(arguments);
				if (func != null && !(func instanceof Error))
					args = [null].concat(args);
				if (args.length > 2) args = [args[0], args.slice(1)];
				func = recvs.shift();
				if (func) func.apply(channel, args);
				else sends.push(args);
			}
			return channel;
		}
	}

	// 新規にチャネルを作成する
	var chan = Channel();

	// コールバックを引数にしてチャネルを呼び出す。
	// チャネルは自分自身のチャネルを返すのでチェインできる。
	// コールバック時のthisはチャネル自身。
	chan(function () {
		console.log('start!'); // 開始!
		setTimeout(this, 500, 'a');
	}, function (err, val) {
		// 処理a
		console.log('a? ' + val);
		setTimeout(this, 500, 'b');
	})(function (err, val) {
		// 処理b
		console.log('b? ' + val);
		setTimeout(this, 500, 'c');
	}, function (err, val) {
		// 処理c
		console.log('c? ' + val);
		console.log('end');
	})();

	// チャネルを保持する変数すら持つ必要は無い。イミフ。
	Channel(function () {
		setTimeout(this, 3000, 'a2');
	}, function (err, val) {
		console.log('a2? ' + val);
		setTimeout(this, 500, 'b2');
	}, function (err, val) {
		console.log('b2? ' + val);
		setTimeout(this, 500, 'c2');
	}, function (err, val) {
		console.log('c2? ' + val);
		var next = this;
		setTimeout(function () {
			next('d2');
		}, 500);
	}, function (err, val) {
		console.log('d2? ' + val);
		// 並行処理。どちらが先に終わるのか...
		var next = this, arr = [], chan2 = Channel(
			function (err, val) { console.log('e2 1st? ' + val); arr.push(val); },
			function (err, val) { console.log('e2 2nd? ' + val); arr.push(val); next(arr); });
		setTimeout(chan2, 300, 'e2X');
		setTimeout(chan2, 200, 'e2Y');
	}, function (err, arr) {
		console.log('e2 arr: ' + arr.join(', '));
		// 複数の値が返ってくる場合は配列で受けること
		this('f1', 'f2', 'f3');
	}, function (err, val) {
		console.log('f values: ' + val.join(', '));
		// Promiseの場合
		this(new Promise(function (res, rej) {
			setTimeout(res, 500, 'g2');
		}));
	}, function (err, val) {
		console.log('g2? ' + val);
		console.log('end');
	})();

}();
// see also npm:co-chan, npm:aa.Channel
