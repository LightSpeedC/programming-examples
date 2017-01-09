'use strict';

const net = require('net');
const name = require('path').basename(__filename);
const log = console.log.bind(console);
const {port} = require('./c10k-socket-config.json');
log(name, 'node:', process.version, 'config:', { port });

const info = { connected: 0, connecting: 0 }, prev = {};
setInterval(() => Object.keys(info).forEach(key => {
	if (prev[key] !== info[key]) {
		prev[key] = info[key];
		log(name, key + ':', info[key]);
	}
}), 1000);

net.createServer(s => {
	++info.connecting;
	let connected;
	s.on('data', data => {
		if (connected) return;
		connected = ++info.connected;
		s.write(data);
	});
	s.on('close', () => {
		--info.connecting;
		connected && --info.connected;
	});
	s.on('error', err => {
		info[err] = (info[err] || 0) + 1;
		s.destroy();
	});
}).listen(port, () => log(name, 'listening port:', port));
