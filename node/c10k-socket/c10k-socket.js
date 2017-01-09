'use strict';

const child_process = require('child_process');
const name = require('path').basename(__filename);

spawn('node', ['c10k-socket-server']);
spawn('node', ['c10k-socket-client']);

function spawn(cmd, args) {
	const p = child_process.spawn(cmd, args);
	p.stdout.pipe(process.stdout);
	p.stderr.pipe(process.stderr);
	p.on('exit', (code, signal) => {
		console.log(name, cmd, args, code, signal);
	});
	return p;
}
