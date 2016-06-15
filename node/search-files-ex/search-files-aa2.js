// ディレクトリやファイルを探す

void function () {
	'use strict';

	module.exports = searchFiles;

	const fs = require('fs');
	const path = require('path');
	const util = require('util');

	const aa = require('aa');
	const statAsync = aa.thunkify(fs, fs.stat);
	const readdirAsync = aa.thunkify(fs, fs.readdir);

	// メイン
	if (require.main === module) {
		aa(function *() {
			const dir = process.argv[2] || '.';
			const rex = process.argv[3] || '';

			try {
				const children = yield searchFiles(dir, rex);
				console.log(util.inspect({[path.resolve(dir)]: children},
					{depth:null, colors:true}));
			} catch (err) { console.error(util.inspect(err, {depth:null, colors:true})); }
		});
	}

	// searchFiles ファイルを検索
	function *searchFiles(dir, rex) {
		dir = path.resolve(dir);
		if (typeof rex === 'string')
			rex = RegExp(rex, 'i');

		let called;
		return search(dir);

		function *search(dir) {
			if (called) return;
			try {
				const stat = yield statAsync(dir);
				if (!stat.isDirectory())
					return null;

				const names = yield readdirAsync(dir);
				const children = {};
				//for (let name of names) { ... }
				yield names.map(name => function *() {
					try {
						children[name] = undefined;
						const fullPath = path.resolve(dir, name);
						const child = yield search(fullPath);
						if (called) return;
						if (child || rex.test(name)) {
							children[name] = child;
							console.log(fullPath);
						}
						else delete children[name];
					} catch (err) {
						called = true;
						throw err;
					}
				});
				return Object.keys(children).length ? children : null;
			} catch (err) {
				called = true;
				throw err;
			}
		} // search
	} // searchFiles

}();
