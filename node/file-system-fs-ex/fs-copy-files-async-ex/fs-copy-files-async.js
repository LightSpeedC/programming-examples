// @ts-check

'use strict';

const fs = require('fs').promises;
const child_process = require('child_process');
const path = require('path');
const w = require('fs').createWriteStream('fs-copy-files-async.log');

const CodeConv = require('./lib/code-conv');
const { toDateTimeString } = require('./lib/date-time-string');

const DIR_SRC = process.argv[2] || '.';
const DIR_DST = process.argv[3] || throwError(new Error('no destination folder!'));
main(DIR_SRC, DIR_DST).catch(err => {
	console.error('DIR_SRC:', DIR_SRC);
	console.error(err);
});

async function main(dirSrc, dirDst, name = '') {
	const fileSrc = path.resolve(dirSrc, name);
	const fileDst = path.resolve(dirDst, name);

	try {
		const stat = await fs.stat(fileSrc);
		if (stat.isDirectory()) {
			console.log('D:', fileSrc);
			console.log('D:', fileDst);
			try {
				const names = await fs.readdir(fileSrc);
				for (const name of names) {
					console.log('+:', fileSrc, name);
					await main(fileSrc, fileDst, name);
					console.log('-:', fileSrc, name);
					try {
						await fs.mkdir(fileDst);
					} catch (err) { }
					console.log('copy', fileSrc + '\\*.*', fileDst + '\\');
					const names2 = await fs.readdir(fileDst);
					if (names.join(',') !== names2.join(',')) {
						const result = await spawnAsync('cmd', ['/c', 'copy', fileSrc + '\\*.*', fileDst + '\\']);
						if (result.code !== 0) {
							w.write(getNow() + ' ■copy■: Error ' + fileSrc + '\r\n');
						}
					}
				}
			}
			catch (err) {
				console.error(getNow() + ' ■readdir■:', err);
				w.write(getNow() + ' ■readdir■: ' + err + '\r\n');
			}
		}
		else {
			console.log('F:', fileSrc);
		}
	}
	catch (err) {
		console.error(getNow() + ' ■stat■:', err);
		w.write(getNow() + ' ■stat■: ' + err + '\r\n');
	}
}

function spawnAsync(cmd, args) {
	return new Promise((resolve, reject) => {
		//
		const ps = child_process.spawn(cmd, args);

		ps.on('close', code => {
			console.log('ps close', code);
			resolve({ code });
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

function throwError(err) {
	console.error('=============================');
	console.error(err);
	console.error('=============================');
	throw err;
}

function getNow() {
	return toDateTimeString();
}