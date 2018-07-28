// require the dependencies
// 依存関係 require
var aa = require('./aa5');
var Channel = aa.Channel;
var co = aa;

// make two channels
// 2つのチャネルを作成します。
var ch1 = Channel();
var ch2 = Channel();

co(function *() {

	// receive value from channel 1
	// チャネル#1から値を受け取ります。
	var value = yield ch1;
	console.log('recv: ch1 =', value);

	// send value into channel 2
	// チャネル#2に値を送り込みます。
	ch2(34);
	console.log('send: ch2 = 34');

})(function (err, val) { if (err) console.log(err); else if (val) console.log(val); });

co(function *() {

	// send value into channel 1
	// チャネル#1に値を送り込みます。
	ch1(12);
	console.log('send: ch1 = 12');

	// receive value from channel 2
	// チャネル#2から値を受け取ります。
	var value = yield ch2;
	console.log('recv: ch2 =', value);

})(function (err, val) { if (err) console.log(err); else if (val) console.log(val); });

// recv: ch1 = 12
// send: ch2 = 34
// send: ch1 = 12
// recv: ch2 = 34
