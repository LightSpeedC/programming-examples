// ディレクトリやファイルを探す

void function () {
	'use strict';

	module.exports = searchFiles;

	const fs = require('fs');
	const path = require('path');

	function searchFiles(dir, rex, cb) {
		dir = path.resolve(dir);
		if (typeof rex === 'string')
			rex = RegExp(rex
				.replace(/\./g, '\\.')
				.replace(/\*/g, '.*'), 'i');

		return search(dir, cb);

		function search(dir, cb) {
			return fs.stat(dir, cb1);

			function cb1(err, stat) {
				if (!stat.isDirectory())
					return cb(null, null);

				return fs.readdir(dir, cb2);

				function cb2(err, names) {
					const result = {};
					if (names.length === 0)
						return cb(null, null);

					return next1();

					function next1() {
						const name = names.shift();
						if (!name)
							return cb(null, Object.keys(result).length ? result : null);

						const fullPath = path.resolve(dir, name);
						return search(fullPath, cb3);

						function cb3(err, r) {
							if (r || rex.test(name)) {
								result[name] = r;
								console.log(fullPath);
							}
							next1();
						} // cb3
					} // next1
				} // cb2
			} // cb1
		} // search
	} // searchFiles

	// メイン (もしメインとして実行したら)
	if (require.main === module) {
		const dir = process.argv[2] || '.';
		const rex = process.argv[3] || '';

		searchFiles(dir, rex, cb0);

		function cb0(err, result) {
			console.log(path.resolve(dir) + ':');
			console.log(JSON.stringify(result, null, '\t')
				.replace(/\"/g, ''));

			const inspect = require('util').inspect;
			console.log(inspect(result, {depth:null, colors:true})
				.replace(/\'/g, ''));
		}
	}

}();
