'use strict'

const fs = require('fs');
const path = require('path');

const dir = process.argv[2] || '.';
renameFilesSync(path.resolve(dir));

function renameFilesSync(dir) {
	try {
		var names = fs.readdirSync(dir);
	} catch (e) {
		console.error('@', dir);
		console.error(e);
		return;
	}
	names.forEach(name => {
		if (/#/.test(name)) {
			const newName = name.replace(/#/g, '$');
			console.log('*', dir, name, newName);
			try {
				fs.renameSync(
					path.resolve(dir, name),
					path.resolve(dir, newName));
				name = newName;
			} catch (e) {
				console.error('@', dir, name);
				console.error(e);
			}
		}
		//else
		//	console.log(' ', dir, name);

		if (/node_modules/.test(name))
			return;

		const full = path.resolve(dir, name);
		const stat = fs.statSync(full);
		if (stat.isDirectory())
			renameFilesSync(full);
	});
}
