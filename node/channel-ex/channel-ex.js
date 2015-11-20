void function () {
	'use strict';

	var push = Array.prototype.push;

	// Channel: チャネル
	function Channel() {
		var values = [], callbacks = Array.apply(null, arguments);
		return function channel(first) {
			if (typeof first === 'function')
				push.apply(callbacks, arguments);
			else if (first && typeof first.then === 'function')
				return first.then(channel, channel), channel;
			else {
				var args = arguments.length === 1 ? [first] : Array.apply(null, arguments);
				if (!(first == null || first instanceof Error)) args.unshift(null);
				values.push(args.length > 2 ? [args.shift(), args] : args);
			}
			while (callbacks.length && values.length)
				try { callbacks.shift().apply(channel, values.shift()); }
				catch (err) { values.unshift([err]); }
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
		throw new Error('d');
	}, function (err, val) {
		// 処理d
		console.log('d err: ' + err);
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
		throw new Error('h2');
	}, function (err, val) {
		console.log('h2 err: ' + err);
		console.log('end');
	})();

}();
// see also npm:co-chan, npm:aa.Channel
