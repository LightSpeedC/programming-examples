'use strict';

const notifier = require('node-notifier');
const path = require('path');

function timeout() {}

notifier.notify({
	// タイトル
	title: 'node-notifierテスト',
	//メッセージ
	message: '例えば、ffmpegを使って、動画の変換を開始！など',
	// 画像 * 絶対パス (windowsのballoonsでは動きません)
	icon: path.join(__dirname, '/img/icon.jpg'),
	// Macのnotification center 又は Windowsトースターのみ
	sound: true,
	// 通知イベントのオプション * クリックイベントやタイムアウト等
	wait: true
	// open: 'file://' + __dirname + '/img/icon.jpg' ファイルを開かせることも出来ます
}, function (err, response) {
	// コールバック関数
	// 通知を出した後、何かをさせる場合はここに処理を記述していきます。
	console.log('\n=<callback>=============================================');
	response = response.trim();
	console.log(err ? (response === 'Timeout' ? response : err) : response);
});

notifier.on('click', function (notifierObject, options) {
	// wait: true の場合にクリックされた時のイベント処理
	console.log('\n=<click>=============================================');
	notifier.notify('クリックされました');
	setTimeout(timeout, 1000);
});

notifier.on('timeout', function (notifierObject, options) {
	console.log('\n=<timeout>=============================================');
	// wait: true の場合にタイムアウト( 何もせず放置 )した時のイベント処理
	notifier.notify('タイムアウトです。');
	setTimeout(timeout, 1000);
});

notifier.on('error', function (notifierObject, options) {
	console.log('\n=<error>=============================================');
	notifier.notify('エラーです。');
	setTimeout(timeout, 1000);
});
