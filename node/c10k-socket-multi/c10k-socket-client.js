'use strict';

const net = require('net');
const name = require('path').basename(__filename);
const config = require('./c10k-socket-config.json');
const offset = Number(process.argv[2] || 0);
console.log(name, 'node', process.version, 'config:', config);

const range = require('./range');

let id = 0;
let conns = 0, conns2 = -1;
const errs = {}, errs2 = {};
setInterval(() => {
	if (conns !== conns2) {
		console.log(name, 'connections:', conns, 'id:', id);
		conns2 = conns;
	}
	Object.keys(errs).forEach(code => {
		if (errs[code] !== errs2[code]) {
			console.log(name, 'errors:', code, errs[code]);
			errs2[code] = errs[code];
		}
	});
}, 1000);

range(config.port_range[0] + offset, config.port_range[1] + offset).forEach(port => {
	for (let i = 0; i < config.conn_limit; ++i) {
		let s = net.createConnection({ port }, () => {
			++id;
			++conns;
		});
		s.on('data', data => { });
		s.on('close', () => --conns);
		s.on('error', err => {
			errs[err.code] = (errs[err.code] || 0) + 1;
			s.end();
		});
	}
});
