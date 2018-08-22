[channel-light](https://www.npmjs.com/package/channel-light)
====

`go`言語みたいなチャネル。CSPスタイルのチャネル。

[English](README.md#readme)


## 準備

```bash
$ npm install channel-light --save
```

[![NPM](https://nodei.co/npm/channel-light.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/channel-light/)
[![NPM](https://nodei.co/npm-dl/channel-light.png?height=2)](https://nodei.co/npm/channel-light/)


## 使い方

### Channel = require('channel-light')

チャネルを準備する。

```js
var Channel = require('channel-light');
```

### channel = new Channel(callback,...)

新しいチャネルを作成する。

```js
var channel = Channel();
```

3つのコールバックと共に新しいチャネルを作成する。

```js
var channel = Channel(
	function (err, val) {},
	function (err, val) {},
	function (err, val) {}
);
```

#### callback(err, val)

コールバック形式。`this`はチャネル自身を示す。

```js
function callback(err, val) {
	// `this`をチャネルとして使える。
	// エラーを`throw`する事もできる。
}
```

### channel = channel(callback,...)

値を受け取るためにコールバックをチャネルに追加する。

```js
channel(function (err, val) {});
channel(
	function (err, val) {},
	function (err, val) {}
);
```

### channel = channel(err, val)

チャネルに値を送る。

```js
channel(null, 'val1');
channel(null, 'val2');
channel(new Error('error'));
```

コールバック引数の正規化を行う。

```js
channel('val1');           // -> callback(null, 'val1')
channel('elem1', 'elem2'); // -> callback(null, ['elem1', 'elem2'])
channel(0);                // -> callback(null, 0)
channel(false);            // -> callback(null, false)
channel(true);             // -> callback(null, true)
```


## 例

```js
void function () {
	'use strict';

	// チャネル
	var Channel = require('channel-light');

	// Channel() は新規にチャネルを作成する。
	var chan = Channel();

	// コールバックを引数にしてチャネルを呼び出す。
	// チャネルは自分自身のチャネルを返すのでチェインできる。
	// コールバック時の`this`はチャネル自身。
	chan(function () {
		console.log('start!'); // start! 開始!
		setTimeout(this, 500, 'a');
	}, function (err, val) {
		// 処理a
		console.log('a? ' + val);
		setTimeout(this, 500, 'b');
	}, function (err, val) {
		// 処理b
		console.log('b? ' + val);
		setTimeout(this, 500, 'c');
	}, function (err, val) {
		// 処理c
		console.log('c? ' + val);
		console.log('end');
	})();

}();
```

```js
void function () {
	'use strict';

	// チャネル
	var Channel = require('channel-light');

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
		// 並行処理。どちらが先に終わるのか...
		var next = this, arr = [], chan2 = Channel(
			function (err, val) { console.log('e2 1st? ' + val); arr.push(val); },
			function (err, val) { console.log('e2 2nd? ' + val); arr.push(val); next(arr); });
		setTimeout(chan2, 300, 'e2X');
		setTimeout(chan2, 200, 'e2Y');
	}, function (err, arr) {
		console.log('e2 arr: ' + arr.join(', '));
		// 複数の値が返ってくる場合は配列で受けること
		this('f21', 'f22', 'f23');
	}, function (err, val) {
		console.log('f2 values: ' + val.join(', '));
		// Promiseの場合
		this(new Promise(function (res, rej) {
			setTimeout(res, 500, 'g2');
		}));
	}, function (err, val) {
		console.log('g2? ' + val);
		console.log('end');
	})();

}();
```


## aa (async-await) を使用したサンプル

```bash
$ npm install aa channel-light
```

2つのスレッドが通信する。

```js
	var Channel = require('channel-light');
	var aa = require('aa');

	aa(function *() {
		yield wait(100, 'a');
		var chan1 = Channel(), chan2 = Channel();
		yield [
			function *() {
				yield wait(100);
				chan2(null, 'request message'); // メッセージを送る
				yield chan1; // メッセージを受ける
				yield wait(100);
			},
			function *() {
				yield wait(200);
				yield chan2; // メッセージを受ける
				yield wait(100);
				chan1(null, 'response message'); // メッセージを送る
				yield wait(100);
			}
		];
	});
	function wait(ms, val) {
		return function (cb) { setTimeout(cb, ms, null, val); };
	}
```


## ライセンス

  MIT


## 参考

+ [参考 npm: aa.Channel](https://www.npmjs.com/package/aa)
+ [参考 npm: co-chan](https://www.npmjs.com/package/co-chan)
