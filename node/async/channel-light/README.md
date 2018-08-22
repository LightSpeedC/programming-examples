[channel-light](https://www.npmjs.com/package/channel-light)
====

`go`-language like Channel. CSP-style channel.

[日本語](README-JP.md#readme)


## PREPARE

```bash
$ npm install channel-light --save
```

[![NPM](https://nodei.co/npm/channel-light.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/channel-light/)
[![NPM](https://nodei.co/npm-dl/channel-light.png?height=2)](https://nodei.co/npm/channel-light/)


## USAGE

### Channel = require('channel-light')

prepare Channel.

```js
var Channel = require('channel-light');
```

### channel = new Channel(callback,...)

make new channel.

```js
var channel = Channel();
```

make new channel with 3 callbacks.

```js
var channel = Channel(
	function (err, val) {},
	function (err, val) {},
	function (err, val) {}
);
```

#### callback(err, val)

callback format. `this` is channel itself.

```js
function callback(err, val) {
	// use `this` as channel.
	// you can `throw` with error.
}
```

### channel = channel(callback,...)

add callback into channel for receive values.

```js
channel(function (err, val) {});
channel(
	function (err, val) {},
	function (err, val) {}
);
```

### channel = channel(err, val)

send values into channel.

```js
channel(null, 'val1');
channel(null, 'val2');
channel(new Error('error'));
```


normalize callback arguments.

```js
channel('val1');           // -> callback(null, 'val1')
channel('elem1', 'elem2'); // -> callback(null, ['elem1', 'elem2'])
channel(0);                // -> callback(null, 0)
channel(false);            // -> callback(null, false)
channel(true);             // -> callback(null, true)
```


## QUICK EXAMPLE

```js
void function () {
	'use strict';

	// Channel
	var Channel = require('channel-light');

	// Channel() creates a new channel.
	var chan = Channel();

	// call channel with callback arguments.
	// channel returns itself, can be chained.
	// `this` is channel when callback.
	chan(function () {
		console.log('start!'); // start!
		setTimeout(this, 500, 'a');
	}, function (err, val) {
		// process a.
		console.log('a? ' + val);
		setTimeout(this, 500, 'b');
	}, function (err, val) {
		// process b.
		console.log('b? ' + val);
		setTimeout(this, 500, 'c');
	}, function (err, val) {
		// process c.
		console.log('c? ' + val);
		console.log('end');
	})();

}();
```

```js
void function () {
	'use strict';

	// Channel
	var Channel = require('channel-light');

	// you don't need variable that keep a channel.
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
		var next = this, arr = [], chan2 = Channel(
			function (err, val) { console.log('e2 1st? ' + val); arr.push(val); },
			function (err, val) { console.log('e2 2nd? ' + val); arr.push(val); next(arr); });
		setTimeout(chan2, 300, 'e2X');
		setTimeout(chan2, 200, 'e2Y');
	}, function (err, arr) {
		console.log('e2 arr: ' + arr.join(', '));
		// you can get an array for multiple values.
		this('f21', 'f22', 'f23');
	}, function (err, val) {
		console.log('f2 values: ' + val.join(', '));
		// when you use Promise.
		this(new Promise(function (res, rej) {
			setTimeout(res, 500, 'g2');
		}));
	}, function (err, val) {
		console.log('g2? ' + val);
		console.log('end');
	})();

}();
```


## EXAMPLE USING aa (async-await)

```bash
$ npm install aa channel-light
```

communicate with 2 threads.

```js
	var Channel = require('channel-light');
	var aa = require('aa');

	aa(function *() {
		yield wait(100, 'a');
		var chan1 = Channel(), chan2 = Channel();
		yield [
			function *() {
				yield wait(100);
				chan2(null, 'request message'); // send message
				yield chan1; // receive message
				yield wait(100);
			},
			function *() {
				yield wait(200);
				yield chan2; // receive message
				yield wait(100);
				chan1(null, 'response message'); // send message
				yield wait(100);
			}
		];
	});
	function wait(ms, val) {
		return function (cb) { setTimeout(cb, ms, null, val); };
	}
```


## LICENSE

  MIT


## SEE ALSO

+ [npm: aa.Channel](https://www.npmjs.com/package/aa)
+ [npm: co-chan](https://www.npmjs.com/package/co-chan)
