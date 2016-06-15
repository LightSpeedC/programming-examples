// ディレクトリやファイルを探す

void function () {
	'use strict';

	module.exports = searchFiles;

	const fs = require('fs');
	const path = require('path');

	const aa = require('aa');
	const statAsync = aa.thunkify(fs, fs.stat);
	const readdirAsync = aa.thunkify(fs, fs.readdir);

	function *searchFiles(dir, rex) {
		dir = path.resolve(dir);
		if (typeof rex === 'string')
			rex = RegExp(rex
				.replace(/\./g, '\\.')
				.replace(/\*/g, '.*'), 'i');

		return search(dir);

		function *search(dir) {
			const stat = yield statAsync(dir);
			if (!stat.isDirectory())
				return null;

			const names = yield readdirAsync(dir);
			const result = {};
			//for (let name of names) {
			yield names.map(name => function *() {
				const fullPath = path.resolve(dir, name);
				const r = yield search(fullPath);
				if (r || rex.test(name)) {
					result[name] = r;
					console.log(fullPath);
				}
			});
			return Object.keys(result).length ? result : null;
		} // search
	} // searchFiles

	// メイン (もしメインとして実行したら)
	if (require.main === module) aa(function *() {
		const dir = process.argv[2] || '.';
		const rex = process.argv[3] || '';

		const result = yield searchFiles(dir, rex);

		console.log(path.resolve(dir) + ':');
		console.log(JSON.stringify(result, null, '\t')
			.replace(/\"/g, ''));

		const inspect = require('util').inspect;
		console.log(inspect(result, {depth:null, colors:true})
			.replace(/\'/g, ''));
	});

}();
