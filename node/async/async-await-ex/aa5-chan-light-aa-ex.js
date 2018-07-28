void function () {
	'use strict';

	// Channel
	// チャネル
	var aa = require('./aa5');
	var Channel = aa.Channel;

	aa(function *() {
		// Channel() creates a new channel.
		// Channel() は新規にチャネルを作成する。
		var chan = Channel();

		console.log('start!'); // start! 開始!
		setTimeout(chan, 500, 'a');
		var val = yield chan;

		// process a. 処理a
		console.log('a? ' + val);
		setTimeout(chan, 500, 'b');
		val = yield chan;

		// process b. 処理b
		console.log('b? ' + val);
		setTimeout(chan, 500, 'c');
		val = yield chan;

		// process c. 処理c
		console.log('c? ' + val);
		console.log('end');
	});

}();
// see also npm:co-chan, npm:aa.Channel
