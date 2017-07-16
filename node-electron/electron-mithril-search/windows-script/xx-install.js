void function () {
	'use strict';

	const dirRex = /\$\$\$/g;
	const exeRex = /###/g;
	const yenRex = /\\/g;
	const yen2Str = '\\\\';

	const child_process = require('child_process');
	const fs = require('fs');

	let res = child_process.spawnSync('where', ['electron.exe']);
	if (res.status || res.signal)
		return console.error(res.status, res.signal);
	const eleExe = res.stdout.toString().split('\n')[0].trim();

	let b = fs.readFileSync('xx-e.reg').toString('UTF16LE');
	b = b.replace(dirRex, __dirname.replace(yenRex, yen2Str))
	.replace(exeRex, eleExe.replace(yenRex, yen2Str));
	fs.writeFileSync('xx-e.reg.log', new Buffer(b, 'UTF16LE'));

	res = child_process.spawnSync('regedit', ['/s', 'xx-e.reg.log']);
	if (res.status || res.signal)
		return console.error(res.status, res.signal);
} ();
