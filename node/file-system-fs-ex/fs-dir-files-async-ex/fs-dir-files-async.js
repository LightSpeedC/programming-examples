// @ts-check

'use strict';

const fs = require('fs').promises;
const child_process = require('child_process');
const path = require('path');

const CodeConv = require('./lib/code-conv');

const DIR = process.argv[2] || '.';

main(DIR).catch(err => {
	console.error('DIR:', DIR);
	console.error(err);
});

async function main(dir, name = '') {
	const file = path.resolve(dir, name);

	const stat = await fs.stat(file);
	if (stat.isDirectory()) {
		console.log('D', file);
		const names = await fs.readdir(file);
		for (const name of names) {
			console.log('+:', file, name);
			await main(file, name);
			await spawnAsync('cmd', ['/c', 'dir', file]);
			console.log('-:', file, name);
		}
	}
	else {
		console.log('F:', file);
	}
}

function spawnAsync(cmd, args) {
	return new Promise((resolve, reject) => {
		//
		const ps = child_process.spawn(cmd, args);

		ps.on('close', code => {
			console.log('ps close', code);
			resolve({code});
		});
		ps.on('exit', code => {
			console.log('ps exit', code);
			// resolve({code});
		});
		ps.on('error', reject);

		ps.stdout.on('data', data => {
			const str = CodeConv.convAny2UniSync(data);
			console.log(str);
		});
		ps.stdout.on('error', reject);

		ps.stderr.on('data', (data) => {
			const str = CodeConv.convAny2UniSync(data);
			console.log(str);
		});
		ps.stderr.on('error', reject);

	})
}
