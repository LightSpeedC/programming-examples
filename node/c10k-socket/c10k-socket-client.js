'use strict';

const net = require('net');
const name = require('path').basename(__filename);
const log = console.log.bind(console);
const {port, conn_limit} = require('./c10k-socket-config.json');
log(name, 'node:', process.version, 'config:', { port, conn_limit });

const info = { connected: 0, connecting: 0, try_connect: 0 }, prev = {};
setInterval(() => Object.keys(info).forEach(key => {
	if (prev[key] !== info[key]) {
		prev[key] = info[key];
		log(name, key + ':', info[key]);
	}
}), 1000);

for (let i = 0; i < conn_limit; ++i) {
	++info.try_connect;
	let connected, connecting, timer;
	let s = net.createConnection({ port }, () => {
		connecting = ++info.connecting;
		s.write('data');
	});
	s.on('data', data => {
		if (connected) return;
		connected = ++info.connected;
		// timer = setInterval(() => s.write('data'), 5000);
	});
	s.on('close', () => {
		connected && --info.connected;
		connecting && --info.connecting;
		// timer && clearInterval(timer);
	});
	s.on('error', err => {
		info[err] = (info[err] || 0) + 1;
		s.destroy();
	});
}
