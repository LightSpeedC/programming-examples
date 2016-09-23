	'use strict';

	const fs = require('fs');
	const path = require('path');
	const child_process = require('child_process');

	let obj = {};

	findDir(process.argv[2] || '.');

	function findDir(dir) {
		dir = path.resolve(dir);
		return find(dir);		

		function find(dir) {
			const names = fs.readdirSync(dir);
			names
				.filter(x => !x.startsWith('.') && (
					!x.includes('.') ||
					//x.endsWith('.js') ||
					(dir.includes('/js') && x.endsWith('.js')) ||
					//x.endsWith('.xml')))
					(dir.includes('/mip') && x.endsWith('.xml'))))
				.map(x => {
					if (x.endsWith('.js')) {
						//console.log('### ' + dir + '/\x1b[41m' + x + '\x1b[m');
						//console.log(path.resolve(dir, x));
						grep('function', path.resolve(dir, x));
					}
					else if (x.endsWith('.xml')) {
						//console.log('### ' + dir + '/\x1b[42m' + x + '\x1b[m');
						//console.log(path.resolve(dir, x));
						grep('function', path.resolve(dir, x));
					}
					return x;
				})
				.filter(x => fs.statSync(path.resolve(dir, x)).isDirectory())
				.map(x => find(path.resolve(dir, x)))
		}
	}

	function grep(word, file) {
		try {
			let buf = fs.readFileSync(file).toString();
			if (buf.startsWith('<<<<'))
				return console.error(file, '@@@@@@@@@@@@@@@@@@@@@');
			// /と*で始まって
			// *以外または、*と/以外
			// *以外または、*と/以外
			// --- /\*/?(\n|[^/]|[^*]/)*\*/
			buf = buf
				//.replace(new RegExp('/\\*([^*]|\\*[^/])*\\*/|//.*', 'g'), '')
				.replace(new RegExp('/\\*/?(\n|[^/]|[^*]/)*\\*/|//.*', 'g'), '')
				.split('\n')
				.filter(x => x.includes(word))
				.map(x => x.trim())
				.filter(x => x.startsWith('function'))
				.map(x => {
					x = x.slice(9);
					let fn = x.split('(')[0];
					let key = file + ':' + fn;
					if (obj[key]) console.error(file, '@', fn);
					obj[key] = true;
					return file + '\t' +
						x.split('(')[0] + '\t' +
						x.split('{')[0];
				})
				.join('\n').trim();
			if (buf) console.log(buf);
			//let buf = child_process.execSync('grep ' + word + ' ' + file);
			//if (buf) console.log(buf.toString());
		} catch (e) {}
	}

