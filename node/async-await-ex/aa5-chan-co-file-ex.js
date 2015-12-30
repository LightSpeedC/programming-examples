// require the dependencies
// 依存関係 require
var aa = require('./aa5');
var Channel = aa.Channel;
var co = aa;
var fs = require('fs');

// make a new channel
// 新しいチャネルを作成します。
var ch = Channel();

// execute a co generator
// co generator を実行します。
co(function *() {

	// pass the channel as the callback to filesystem read file function
	// this will push the file contents in to the channel
	// ファイルシステムのファイル読込み関数のコールバックとして
	// チャネルを渡すと、ファイル内容がチャネルに送り込まれます。
	fs.readFile(__dirname + '/README.md', ch);

	// yield the channel to pull the value off the channel
	// チャネルを yield するとチャネルの値を受け取れます。
	var contents = yield ch;

	// use the value as you like
	// 後は好きに値が使えます。
	console.log(String(contents));

})(function (err, val) { if (err) console.log(err); else if (val) console.log(val); });
