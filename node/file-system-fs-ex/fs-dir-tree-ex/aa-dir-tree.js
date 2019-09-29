// aa-dir-tree.js

this.dirTreeAsync = function () {
	'use strict';

	var fs = require('fs');
	var path = require('path');

	var aa = require('aa'), thunkify = aa.thunkify;
	var fs_readdir = thunkify(fs.readdir);
	var fs_stat = thunkify(fs.stat);

	var $totalsize = '*totalsize*';
	var $dirsize = '*dirsize*';

	// *dirTreeAsync(dir)
	function *dirTreeAsync(dir) {
		dir = path.resolve(dir || '.');

		try {
			var names = yield fs_readdir(dir);
		} catch (err) {
			console.log(err.stack);
			return null;
		}

		var totalsize = 0;
		var dirsize = 0;
		var children = {};

		names.forEach(name => children[name] = null);

		yield names.map(name => function *() {
			var file = path.resolve(dir, name);
			try {
				var stat = yield fs_stat(file);
			} catch (err) {
				console.log(err.stack);
				return;
			}
			var child = stat.isDirectory() ? yield dirTreeAsync(file) : null;
			children[name] = child ? child : stat.size;
			totalsize += stat.size + (child ? child[$totalsize] : 0);
			dirsize += stat.size;
		});

		children[$dirsize] = dirsize;
		children[$totalsize] = totalsize;
		return children;

	}

	// node.js module.exports
	if (typeof module === 'object' && module && module.exports) {
		module.exports = dirTreeAsync;

		// main
		if (require.main === module) {
			aa(function *() {
				console.time('async');
				var tree = yield dirTreeAsync(process.argv[2]);
				console.timeEnd('async');
				//console.log(require('util').inspect(tree,
				//	{colors: true, depth: null}).replace(/\'/g, ''));
			});
		}

	}

	return dirTreeAsync;
}();
