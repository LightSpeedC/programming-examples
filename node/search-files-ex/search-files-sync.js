// ディレクトリやファイルを探す

void function () {
	'use strict';

	module.exports = searchFiles;

	const fs = require('fs');
	const path = require('path');

	function searchFiles(dir, rex) {
		dir = path.resolve(dir);
		if (typeof rex === 'string')
			rex = RegExp(rex
				.replace(/\./g, '\\.')
				.replace(/\*/g, '.*'), 'i');

		return search(dir);

		function search(dir) {
			const stat = fs.statSync(dir);
			if (!stat.isDirectory())
				return null;

			const names = fs.readdirSync(dir);
			const result = {};
			//names.forEach(name => { ... });
			for (let name of names) {
				const fullPath = path.resolve(dir, name);
				const r = search(fullPath);
				if (r || rex.test(name)) {
					result[name] = r;
					console.log(fullPath);
				}
			}
			return Object.keys(result).length ? result : null;
		} // search
	} // searchFiles

	// メイン (もしメインとして実行したら)
	if (require.main === module) {
		const dir = process.argv[2] || '.';
		const rex = process.argv[3] || '';

		const result = searchFiles(dir, rex);

		console.log(path.resolve(dir) + ':');
		console.log(JSON.stringify(result, null, '\t')
			.replace(/\"/g, ''));

		const inspect = require('util').inspect;
		console.log(inspect(result, {depth:null, colors:true})
			.replace(/\'/g, ''));
	}

}();
