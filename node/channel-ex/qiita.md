ES5にこだわっておられる様なので、チャネルという非同期呼出し時にも非同期処理待ちにも使える小さなライブラリを紹介します。
(IE以外の全ブラウザで実装されてる`ES2015(ES6) generators(yield)`を使えばこういう苦労は必要なくなります)

以下、即席で作ったChannelという小さなライブラリです。

```js
	// Channel (mini): チャネル (ミニ)
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
		};
	}
```

以下、実行例1です。

```js
	// Channel() は新規にチャネルを作成する。
	var chan = Channel();

	// コールバックを引数にしてチャネルを呼び出す。
	// チャネルは自分自身のチャネルを返すのでチェインできる。
	// コールバック時の`this`はチャネル自身。
	chan(function () {
		console.log('start!'); // 開始!
		setTimeout(this, 500, null, 'a');
	})(function (err, val) {
		// 処理a
		console.log('a? ' + val);
		setTimeout(this, 500, null, 'b');
	})(function (err, val) {
		// 処理b
		console.log('b? ' + val);
		setTimeout(this, 500, null, 'c');
	})(function (err, val) {
		// 処理c
		console.log('c? ' + val);
		console.log('end');
	})();
```

以下、実行例2です。

```js
	// チャネルを保持する変数すら持つ必要は無い。
	Channel(function () {
		setTimeout(this, 500, null, 'a2');
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
		// 並行処理。どちらが先に終わるのか...
		var next = this, arr = [];
		var chan2 = Channel(
			function (err, val) { console.log('e2 1st? ' + val); arr.push(val); },
			function (err, val) { console.log('e2 2nd? ' + val); arr.push(val); next(null, arr); });
		setTimeout(chan2, 300, null, 'e2X');
		setTimeout(chan2, 200, null, 'e2Y');
	}, function (err, arr) {
		console.log('e2 arr: ' + arr.join(', '));
		// 複数の値は配列で受けること
		this(null, ['f21', 'f22', 'f23']);
	}, function (err, val) {
		console.log('f2 values: ' + val.join(', '));
		console.log('end');
	})();
```

以下、aaを使った例です。

```js
	'use strict';
	var aa = require('aa');
	aa(function *() {
		console.log('a4? ' + (yield wait(500, 'a4')));
		console.log('b4? ' + (yield wait(500, 'b4')));
		console.log('c4? ' + (yield wait(500, 'c4')));
		console.log('d4? ' + (yield wait(500, 'd4')));
		// parallel processing.
		// 並行処理。
		console.log('e4 arr: ' + (yield [wait(300, 'e4X'), wait(200, 'e4Y')]).join(', '));
		console.log('end');
	});
	function wait(ms, val) {
		return function (cb) { setTimeout(cb, ms, null, val); };
	}
```

`ES2015(ES6) generators (yield)`だけは使おうよ。

参考文献です。以下のリンク先も参考にしてください。

+ [[JavaScript] 非同期処理のコールバック地獄から抜け出す方法 - Qiita](http://qiita.com/LightSpeedC/items/7980a6e790d6cb2d6dad)
+ [ES7 async/await + Promise で解決できる事、とES6 generators (yield) + Promise + npm aa (async-await) で解決できる事 - Qiita](http://qiita.com/LightSpeedC/items/95e3db59276e5d1d1a0d)
+ [参考 npm: channel-light - 今回publishしました](https://www.npmjs.com/package/channel-light)
+ [参考 npm: aa.Channel](https://www.npmjs.com/package/aa)
+ [参考 npm: co-chan](https://www.npmjs.com/package/co-chan)
+ [参考オリジナル npm: chan](https://www.npmjs.com/package/chan)
