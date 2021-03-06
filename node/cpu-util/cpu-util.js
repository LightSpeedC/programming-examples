// @ts-check

'use strict';

const os = require('os');
const DateTime = require('./date-time-string');
const toDateTimeString = DateTime.toDateTimeString;

const prev = os.cpus();
const KEYS = Object.keys(prev[0].times);

const round = x => Math.round(x * 10) / 10;
const fmtPct = x => ('  ' + round(x).toFixed(1) + '%').substr(-6);

const getInfo = () => ({
	cpus: os.cpus().map((cpu, i) => {
		const dif = KEYS.reduce((dif, k) => {
			dif[k] = cpu.times[k] - prev[i].times[k];
			prev[i].times[k] = cpu.times[k];
			return dif;
		}, { });
		const sum = KEYS.reduce((sum, k) => sum + dif[k], 0);
		return KEYS.reduce((load, k) => (load[k] = dif[k] / sum * 100, load),
			{util: (sum - dif.idle) / sum * 100});
	}),
	memory: {util: (os.totalmem() - os.freemem()) / os.totalmem() * 100,
		totalmem: os.totalmem(), freemem: os.freemem()},
	// uptime: os.uptime(),
	// loadavg: os.loadavg(),		// 1, 5, and 15 min's load avg
	timestamp: toDateTimeString(),
});

function showInfo() {
	const info = getInfo();
	const cpuUtil = info.cpus.reduce((sum, cpu) => sum + cpu.util, 0) / info.cpus.length;

	console.log(process.env.HOSTNAME || process.env.COMPUTERNAME,
		'■'.repeat(cpuUtil / 5) +
		'□'.repeat((100 - cpuUtil) / 5),
		'cpu:' + fmtPct(cpuUtil),
		'mem:' + fmtPct(info.memory.util),
		info.timestamp);
}

setTimeout(showInfo, 100);
setTimeout(showInfo, 400);
setTimeout(showInfo, 1000);
setTimeout(showInfo, 4000);
setTimeout(showInfo, 10 * 1000);
setInterval(showInfo, 30 * 1000);
