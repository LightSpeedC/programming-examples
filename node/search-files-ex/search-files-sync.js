// ディレクトリやファイルを探す

void function () {
	'use strict';

	module.exports = searchFiles;

	const fs = require('fs');
	const path = require('path');

	// メイン
	if (require.main === module) {
		const dir = process.argv[2] || '.';
		const rex = process.argv[3] || '';

		try {
			const children = searchFiles(dir, rex);
			console.log(dir, inspect(children));
		} catch (err) { console.error(inspect(err)); }
	}

	// searchFiles ファイルを検索
	function searchFiles(dir, rex) {
		dir = path.resolve(dir);
		if (typeof rex === 'string')
			rex = new RegExp(rex, 'i');

		return search(dir);

		function search(dir) {
			const stat = fs.statSync(dir);
			if (!stat.isDirectory())
				return null;

			const names = fs.readdirSync(dir);
			const children = {};
			//names.forEach(name => { ... });
			for (let name of names) {
				const fullPath = path.resolve(dir, name);
				const child = search(fullPath);
				if (child || rex.test(name)) {
					children[name] = child;
					console.log(fullPath);
				}
			}
			return Object.keys(children).length ? children : null;
		} // search
	} // searchFiles

	// util.inspect
	function inspect(x) {
		return require('util').inspect(x, {depth:null, colors:true});
	}

}();
