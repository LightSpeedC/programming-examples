void function () {
	'use strict';

	try {
		require('fs').writeFileSync('processid.log',
			'プロセスID: ' + process.pid + '\n');

		// カウント
		if (!global.myCount) global.myCount = 0;

		// package.jsonのwindowオプションの初期値を取り込む
		const options = require('./package.json').window || {};
		const x = options.x = options.x || 200;
		const y = options.y = options.y || 100;

		// Windowを開く
		global.openMyWindow = function openMyWindow() {
			nw.Window.open('index.html', options, function (win) {
				++myCount;
			});
			options.x += 40;
			options.y += 10;
			if (options.x >= 600 + myCount * 5 ||
				options.y >= 200 - myCount) {
				options.x = x + myCount * 5;
				options.y = y - myCount;
			}
		}
		openMyWindow();
	} catch (e) {
		alert(e.stack);
	}
}();
