// tree_list.js

void function () {
	'use strict';

	const fs = require('fs');
	const path = require('path');

	const outFile = process.argv[2] || 'tree-list.log';
	const pattern = process.argv[3] || '*';
	const dir = path.resolve(process.argv[4] || '.');
	const regex = new RegExp(pattern.replace(new RegExp('\\*', 'g'), '.*'));
	console.log(regex);
	const w = fs.createWriteStream(outFile);

	function println(str) {
		w.write(str + '\r\n');
		console.log(str);
	}


	println(dir);
	const tree = searchFiles(dir, 3, regex);

	function searchFiles(dir, maxDepth) {
		return search(dir, ' ', 0, '');

		function search(dir, nm, n, ind) {
			const result = {};

			//const stat = fs.statSync(dir);
			//if (stat.isDirectory()) {
				println(ind + '・' + nm);
				ind = ind.replace(/┣/g, '┃');
				ind = ind.replace(/┗/g, '　');
				if (n > maxDepth) return {'*': {}};
				const names = fs.readdirSync(dir);
				const xx = names.map(name => ({fp:path.resolve(dir, name), name:name}))
					.filter(f => fs.statSync(f.fp).isDirectory());

				for (let x of xx) {
					result[x.name] = search(x.fp, x.name, n + 1, ind +
						(x.name === xx[xx.length - 1].name ? '┗' : '┣'));
				}
			//}
			//else {
			//	return null;
			//}
		}
	}

} ();
