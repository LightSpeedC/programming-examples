// ディレクトリやファイルを探す

void function () {
	'use strict';

	module.exports = searchFiles;

	const fs = require('fs');
	const path = require('path');
	const util = require('util');

	// メイン
	if (require.main === module) {
		const dir = process.argv[2] || '.';
		const rex = process.argv[3] || '';

		try {
			const children = searchFiles(dir, rex);
			console.log(util.inspect({[path.resolve(dir)]: children},
				{depth:null, colors:true}));
		} catch (err) { console.error(util.inspect(err, {depth:null, colors:true})); }
	}

	// searchFiles ファイルを検索
	function searchFiles(dir, rex) {
		dir = path.resolve(dir);
		if (typeof rex === 'string')
			rex = RegExp(rex, 'i');

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

}();
