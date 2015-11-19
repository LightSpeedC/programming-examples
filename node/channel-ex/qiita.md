ES5にこだわっておられる様なので、チャネルという非同期呼出し時にも非同期処理待ちにも使える小さなライブラリを紹介します。
(IE以外の全ブラウザで実装されてるES6 generatorsを使えばこういう苦労は必要なくなります)

以下、即席で作ったChannelという小さなライブラリです。

```js
	// Channel: チャネル
	function Channel() {
		var recvs = [].slice.call(arguments), sends = [];
		return function channel(func) {
			var args;
			if (typeof func === 'function')
				for (var i = 0; i < arguments.length; ++i) {
					if (typeof arguments[i] !== 'function')
						throw new TypeError('arguments must be a function!');
					(args = sends.shift()) ? arguments[i].apply(channel, args) : recvs.push(arguments[i]);
				}
			else
				(func = recvs.shift()) ? func.apply(channel, arguments): sends.push(arguments);
			return channel;
		}
	}
```

以下、実行例1です。

```js
	// 新規にチャネルを作成する
	var chan = Channel();

	// コールバックを引数にしてチャネルを呼び出す。
	// チャネルは自分自身のチャネルを返すのでチェインできる。
	// コールバック時のthisはチャネル自身。
	chan(function () {
		console.log('start!'); // 開始!
		setTimeout(this, 500, null, 'a');
	}, function (err, val) {
		// 処理a
		console.log('a? ' + val);
		setTimeout(this, 500, null, 'b');
	})(function (err, val) {
		// 処理b
		console.log('b? ' + val);
		setTimeout(this, 500, null, 'c');
	}, function (err, val) {
		// 処理c
		console.log('c? ' + val);
		console.log('end');
	})();
```

以下、実行例2です。

```js
	// チャネルを保持する変数すら持つ必要は無い。イミフ。
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
		// 並行処理。どちらが先に終わるのか...
		var next = this, res = [], chan2 = Channel(
			function (err, val) { console.log('e2 1st? ' + val); res.push(val); },
			function (err, val) { console.log('e2 2nd? ' + val); res.push(val); next(null, res); });
		setTimeout(chan2, 300, null, 'e2X');
		setTimeout(chan2, 200, null, 'e2Y');
	}, function (err, res) {
		console.log('e2 res: ' + res.join(', '));
		console.log('end');
	})();
```

参考文献です。以下のリンク先も参考にしてください。

+ [[JavaScript] 非同期処理のコールバック地獄から抜け出す方法 - Qiita](http://qiita.com/LightSpeedC/items/7980a6e790d6cb2d6dad)
+ [ES7 async/await + Promise で解決できる事、とES6 generators (yield) + Promise + npm aa (async-await) で解決できる事 - Qiita](http://qiita.com/LightSpeedC/items/95e3db59276e5d1d1a0d)
+ [参考 npm:aa.Channel](https://www.npmjs.com/package/aa)
+ [参考 npm:co-chan](https://www.npmjs.com/package/co-chan)
+ [参考オリジナル npm:chan](https://www.npmjs.com/package/chan)
