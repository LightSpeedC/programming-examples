void function () {
	'use strict';

	// package.jsonのwindowオプションの初期値を取り込む
	const options = require('./package.json').window;

	// NWjs/node-webkit
	if (global.nw) {
		// Windowを開く
		nw.Window.open('index.html', options);
		return;
	}

	// Electron/Atom-Shell
	const electron = require('electron');
	const {app, BrowserWindow} = electron;

	const wins = new Map();

	function createWindow() {
		const win = new BrowserWindow(options);
		wins.set(win, true);
		win.loadURL('file://' + __dirname + '/index.html');
		win.webContents.openDevTools();
		win.on('closed', () => wins.delete(win));
	}

	app.on('ready', createWindow);
	app.on('window-all-closed',
		() => process.platform !== 'darwin' && app.quit());
	app.on('activate', () => wins.size || createWindow());
}();
