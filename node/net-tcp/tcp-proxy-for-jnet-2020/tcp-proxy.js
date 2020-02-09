'use strict';

module.exports = tcpProxy;

const fs = require('fs');
const net = require('net');
const path = require('path');
const util = require('util');

const { DateTimeString, getDateString, getTimeString } = require('./get-date-time');
const mkdirParentsAsync = require('./mkdir-parents-async');
const Channel = require('./channel-mini');

const writeFileAsync = util.promisify(fs.writeFile);

let lastDir = '';
async function genLogsDir(logsDirRoot) {
	const logsDir = path.resolve(logsDirRoot, getDateString());

	if (lastDir !== logsDir) {
		lastDir = logsDir;
		await mkdirParentsAsync(logsDir);
	}

	return logsDir;
}

async function tcpProxy(config) {
	const logsDirRoot = path.resolve(config.logsDirRoot || 'logs');
	const logsDir = await genLogsDir(logsDirRoot);

	const logChan = Channel();
	logWriter(logChan).catch(err => console.error(err));

	for (let servicePort of Object.keys(config.services)) {
		const service = config.services[servicePort];
		await tcpProxyStart(Number(servicePort), service);
	}

	async function logWriter(logChan) {
		let logPacket;
		while (logPacket = await logChan) {
			const { svc, type, data, date, time } = logPacket;
			console.log('log:', svc, type, date, time, data);

			const logsDir = await genLogsDir(logsDirRoot);
			const name = date + '-' + time + '-' + svc.id + '-' + type + '.dat';
			await writeFileAsync(path.resolve(logsDir, name), data);
		}
	}

	async function tcpProxyStart(servicePort, service) {
		net.createServer({allowHalfOpen: false}, c => {
			const svc = service[c.remoteAddress] || service['*'] || throws(new Error(''));
			const [hostname, port] = svc.to;
			const id = svc.id;
			console.log('connected', port, {remoteAddress: c.remoteAddress}, {id, port, hostname});

			const s = net.connect(port, hostname);
			c.on('data', data => { s.write(data); log('req', data); });
			s.on('data', data => { c.write(data); log('res', data); });
			c.on('error', e => {
				e.code === 'ECONNRESET' || console.log('c:' + e);
				c.end(), s.end(); });
			s.on('error', e => {
				e.code === 'ECONNRESET' || console.log('s:' + e);
				c.end(), s.end(); });
			c.on('end', () => s.end());
			s.on('end', () => c.end());

			function log(type, data) {
				const date = getDateString();
				const time = getTimeString();
				logChan(null, { svc, type, data, date, time });
			}

		}).listen(servicePort, () => {
			console.log('listen start', servicePort);
		});
	}

	function throws(err) {
		throw err;
	}
}
