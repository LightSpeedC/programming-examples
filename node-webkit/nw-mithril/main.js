void function () {
	'use strict';

	const fs = require('fs');

/*
	const engine = global.nw ? 'node-webkit' : 'electron';
	const zzz = 'zzz-' + engine;
	try { fs.unlinkSync(zzz + '2.log'); } catch (e) {}
	try { fs.renameSync(zzz + '1.log', zzz + '2.log'); } catch (e) {}
	try { fs.renameSync(zzz + '.log',  zzz + '1.log'); } catch (e) {}
	fs.writeFileSync(zzz + '.log', [
		engine,
		'process.pid: ' + process.pid,
		'process.argv: ' + JSON.stringify(process.argv, null, '\t'),
		'process.env: ' + JSON.stringify(process.env, null, '\t'),
		''].join('\n\n'));
*/

	// package.jsonのwindowオプションの初期値を取り込む
	const options = require('./package.json').window;

	process.env.AAA_TARGET_DIR = (process.env.AAA_TARGET_DIR
		|| process.argv[2] || process.argv[1] || '..').replace('"', '');

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
		//win.webContents.openDevTools();
		win.on('closed', () => wins.delete(win));
	}

	app.on('ready', createWindow);
	app.on('window-all-closed',
		() => process.platform !== 'darwin' && app.quit());
	app.on('activate', () => wins.size || createWindow());
}();
