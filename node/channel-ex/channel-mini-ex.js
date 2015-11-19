void function () {
	'use strict';

	// Channel (mini)
	// チャネル (ミニ)
	function Channel() {
		var recvs = [].slice.call(arguments), sends = [];
		return function channel(first) {
			if (typeof first === 'function')
				if (sends.length) first.apply(channel, sends.shift());
				else recvs.push(first);
			else
				if (recvs.length) recvs.shift().apply(channel, arguments);
				else sends.push(arguments);
			return channel;
		}
	}

	// Channel() creates a new channel.
	// Channel() は新規にチャネルを作成する。
	var chan = Channel();

	// call channel with callback arguments.
	// コールバックを引数にしてチャネルを呼び出す。
	// channel returns itself, can be chained.
	// チャネルは自分自身のチャネルを返すのでチェインできる。
	// `this` is channel when callback.
	// コールバック時の`this`はチャネル自身。
	chan(function () {
		console.log('start!'); // start! 開始!
		setTimeout(this, 500, null, 'a');
	})(function (err, val) {
		// process a. 処理a
		console.log('a? ' + val);
		setTimeout(this, 500, null, 'b');
	})(function (err, val) {
		// process b. 処理b
		console.log('b? ' + val);
		setTimeout(this, 500, null, 'c');
	})(function (err, val) {
		// process c. 処理c
		console.log('c? ' + val);
		console.log('end');
	})();

	// you don't need variable that keep a channel.
	// チャネルを保持する変数すら持つ必要は無い。
	Channel(function () {
		setTimeout(this, 3000, null, 'a2');
	}, function (err, val) {
		console.log('a2? ' + val);
		setTimeout(this, 500, null, 'b2');
	}, function (err, val) {
		console.log('b2? ' + val);
		setTimeout(this, 500, null, 'c2');
	}, function (err, val) {
		console.log('c2? ' + val);
		var next = this;
		setTimeout(function () {
			next(null, 'd2');
		}, 500);
	}, function (err, val) {
		console.log('d2? ' + val);
		// parallel processing. which one is first?
		// 並行処理。どちらが先に終わるのか...
		var next = this, arr = [], chan2 = Channel(
			function (err, val) { console.log('e2 1st? ' + val); arr.push(val); },
			function (err, val) { console.log('e2 2nd? ' + val); arr.push(val); next(null, arr); });
		setTimeout(chan2, 300, null, 'e2X');
		setTimeout(chan2, 200, null, 'e2Y');
	}, function (err, arr) {
		console.log('e2 arr: ' + arr.join(', '));
		// you have to get an array for multiple values.
		// 複数の値は配列で受けること
		this(null, ['f21', 'f22', 'f23']);
	}, function (err, val) {
		console.log('f2 values: ' + val.join(', '));
		console.log('end');
	})();

}();
// see also npm:co-chan, npm:aa.Channel
