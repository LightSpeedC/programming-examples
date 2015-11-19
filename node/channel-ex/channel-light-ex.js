void function () {
	'use strict';

	// Channel
	// チャネル
	var Channel = require('channel-light');

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
		setTimeout(this, 500, 'a');
	}, function (err, val) {
		// process a. 処理a
		console.log('a? ' + val);
		setTimeout(this, 500, 'b');
	}, function (err, val) {
		// process b. 処理b
		console.log('b? ' + val);
		setTimeout(this, 500, 'c');
	}, function (err, val) {
		// process c. 処理c
		console.log('c? ' + val);
		console.log('end');
	})();

	// you don't need variable that keep a channel.
	// チャネルを保持する変数すら持つ必要は無い。
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
		// parallel processing. which one is first?
		// 並行処理。どちらが先に終わるのか...
		var next = this, arr = [], chan2 = Channel(
			function (err, val) { console.log('e2 1st? ' + val); arr.push(val); },
			function (err, val) { console.log('e2 2nd? ' + val); arr.push(val); next(arr); });
		setTimeout(chan2, 300, 'e2X');
		setTimeout(chan2, 200, 'e2Y');
	}, function (err, arr) {
		console.log('e2 arr: ' + arr.join(', '));
		// you can get an array for multiple values.
		// 複数の値が返ってくる場合は配列で受けること
		this('f21', 'f22', 'f23');
	}, function (err, val) {
		console.log('f2 values: ' + val.join(', '));
		// when you use Promise.
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
