'use strict';

const spawn = require('child_process').spawn;
const isWindows = process.platform === 'win32';

module.exports = function (electron) {

	return { openItem, showItemInFolder };

	// フォルダやファイルを開く
	function openItem(file) {
		isWindows ?
			spawn('explorer', [file]) :
			electron.shell.openItem(file);
		return;
	}

	// ファイルのあるフォルダを開く
	function showItemInFolder(file) {
		blur();
		electron.shell.showItemInFolder(file);
		return;
	}

};
