// @ts-check

'use strict';

const os = require('os');

const prev = os.cpus();
const TYPES = Object.keys(prev[0].times);

function getInfo() {
	return {
		cpus: os.cpus().map((cpu, i) => {
			const delta = TYPES.reduce((delta, type) => {
				delta[type] = cpu.times[type] - prev[i].times[type];
				prev[i].times[type] = cpu.times[type];
				return delta;
			}, { });
		const total = TYPES.reduce((total, type) => total + delta[type], 0);
		return TYPES.reduce((load, type) => (load[type] = Math.round(delta[type] / total * 1000) / 10, load), {});
	}),
	// totalmem: os.totalmem(),
	// freemem: os.freemem(),
	// uptime: os.uptime(),
	// loadavg: os.loadavg(),		// 1, 5, and 15 min's load avg
	timestamp: new Date().toLocaleString(),
	};
}

setInterval(() => console.log(getInfo()), 5000);
