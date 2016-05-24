// ディレクトリやファイルを探す

void function () {
	'use strict';

	module.exports = findDirFiles;

	const fs = require('fs');
	const path = require('path');
	const util = require('util');

	function findDirFiles(dir, pattern) {
		const names = fs.readdirSync(dir);
		const result = {};
		//names.forEach(name => result[name] = undefined);
		names.forEach(name => {
			const subDir = path.resolve(dir, name);
			const stat = fs.statSync(subDir);
			if (stat.isDirectory()) {
				const r = findDirFiles(subDir, pattern);
				if (r)
					result[name] = r;
				else if (name.includes(pattern))
					result[name] = [];
			}
			else {
				if (name.includes(pattern))
					result[name] = null;
			}
		});
		//console.log(Object.keys(result));
		if (Object.keys(result).length === 0)
			return null;
		return result;
	}

	// メイン
	if (require.main === module) {
		const dir = path.resolve(process.argv[2] || '.');
		const pattern = process.argv[3] || '?';
		const result = findDirFiles(dir, pattern);
		console.log(util.inspect({[dir]: result}, {depth:null, colors:true})
			.replace(new RegExp("'", 'g'), ''));
	}

}();