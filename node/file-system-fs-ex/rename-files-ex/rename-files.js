'use strict';
const dir = process.argv[2];
if (!dir) return console.error('specify directory!');

const fs = require('fs');
const path = require('path');
const files = fs.readdirSync(dir);
const fols = files
	.filter(x => x.match(/\d{4}-\d{2}-\d{2}/))
	.filter(x => {
		const stat = fs.statSync(path.resolve(dir, x));
		return stat.isDirectory();
	});
const map = {};
fols.forEach(x => map[x.substr(0, 10)] = path.resolve(dir, x));

console.log(map);
files.forEach(x => {
	const stat = fs.statSync(path.resolve(dir, x));
	if (stat.isDirectory()) return;
	const d = stat.mtime;
	const k = d.getFullYear() + '-' +
		('0' + (d.getMonth() + 1)).substr(-2) + '-' +
		('0' + d.getDate()).substr(-2);
	if (!map[k]) {
		map[k] = path.resolve(dir, k);
		fs.mkdirSync(map[k]);
	}
	fs.renameSync(path.resolve(dir, x), path.resolve(map[k], x));
	//console.log(d.toString(), k);
});

//console.log(fols);

//.forEach(x => fs.renameSync(x, x.replace(/ex10-/, '')))
