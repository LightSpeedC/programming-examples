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

		searchFiles(dir, rex, function (err, children) {
			if (err) return console.error(util.inspect(err, {depth:null, colors:true}));
			console.log(util.inspect({[path.resolve(dir)]: children},
				{depth:null, colors:true}));
		});
	}

	// searchFiles ファイルを検索
	function searchFiles(dir, rex, cb) {
		dir = path.resolve(dir);
		if (typeof rex === 'string')
			rex = RegExp(rex, 'i');

		let called;
		return search(dir, function (err, value) {
			if (called) return;
			called = true;
			cb(err, value);
		});

		function search(dir, cb) {
			if (called) return;

			fs.stat(dir, function (err, stat) {
				if (called || err) return cb(err);

				if (!stat.isDirectory())
					return cb(null, null);

				return fs.readdir(dir, function (err, names) {
					if (called || err) return called || cb(err);

					const children = {};
					if (names.length === 0)
						return cb(null, null);

					next();

					function next() {
						const name = names.shift();
						if (!name)
							return cb(null, Object.keys(children).length ? children : null);

						const fullPath = path.resolve(dir, name);
						search(fullPath, function (err, child) {
							if (called || err) return called || cb(err);

							if (child || rex.test(name)) {
								children[name] = child;
								console.log(fullPath);
							}
							next();
						}); // search
					} // next
				}); // fs.readdir
			}); // fs.stat
		} // search
	} // searchFiles

}();
