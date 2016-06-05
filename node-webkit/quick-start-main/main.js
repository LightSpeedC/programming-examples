// package.jsonのwindowオプションの初期値を取り込む
const options = require('./package.json').window || {};

// Windowを開く
nw.Window.open('index.html', options);

require('fs').writeFileSync('process.log',
	['process.pid = ' + process.pid,
	'process.argv = ' + process.argv.join(' '),
	'App.manifest.name = ' + nw.App.manifest.name,
	'App.argv = ' + nw.App.argv.join(' '),
	'App.fullArgv = ' + nw.App.fullArgv.join(' '),
	'App.filteredArgv = ' + nw.App.filteredArgv.join(' '),
	''].join('\n'));
