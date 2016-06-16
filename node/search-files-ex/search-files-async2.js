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

		searchFiles(dir, rex, function (err, children) {
			if (err) return console.error(inspect(err));
			console.log(dir, inspect(children));
		});
	}

	// searchFiles ファイルを検索
	function searchFiles(dir, rex, cb) {
		dir = path.resolve(dir);
		if (typeof rex === 'string')
			rex = new RegExp(rex, 'i');

		let end = false;
		return search(dir, function (err, value) {
			if (end) return;
			end = true;
			cb(err, value);
		});

		function search(dir, cb) {
			if (end) return;

			fs.stat(dir, function (err, stat) {
				if (end || err) return end || cb(new Error(err.stack));

				if (!stat.isDirectory())
					return cb(null, null);

				return fs.readdir(dir, function (err, names) {
					if (end || err) return end || cb(new Error(err.stack));

					const children = {};
					if (names.length === 0)
						return cb(null, null);

					let n = names.length;
					//names.forEach(name => { ... });
					for (let name of names) {
						children[name] = undefined;
						const fullPath = path.resolve(dir, name);
						search(fullPath, function (err, child) {
							if (end || err) return end || cb(err);

							if (child || rex.test(name)) {
								children[name] = child;
								console.log(fullPath);
							}
							else delete children[name];
							if (--n === 0)
								return cb(null, Object.keys(children).length ? children : null);
						}); // search
					} // for name of names
				}); // fs.readdir
			}); // fs.stat
		} // search
	} // searchFiles

	// util.inspect
	function inspect(x) {
		return require('util').inspect(x, {depth:null, colors:true});
	}

}();
