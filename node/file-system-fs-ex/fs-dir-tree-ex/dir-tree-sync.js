// dir-tree-sync.js

this.dirTreeSync = function () {
	'use strict';

	var fs = require('fs');
	var path = require('path');

	var $totalsize = '*totalsize*';
	var $dirsize = '*dirsize*';

	// dirTreeSync(dir)
	function dirTreeSync(dir) {
		dir = path.resolve(dir || '.');

		try {
			var names = fs.readdirSync(dir);
		} catch (err) {
			console.log(err.stack);
			return null;
		}

		var totalsize = 0;
		var dirsize = 0;
		var children = {};

		names.forEach(name => children[name] = null);

		names.forEach(name => {
			var file = path.resolve(dir, name);
			try {
				var stat = fs.statSync(file);
			} catch (err) {
				console.log(err.stack);
				return;
			}
			var child = stat.isDirectory() ? dirTreeSync(file) : null;
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
		module.exports = dirTreeSync;

		// main
		if (require.main === module) {
			(() => {
				console.time('sync');
				var tree = dirTreeSync(process.argv[2]);
				console.timeEnd('sync');
				//console.log(require('util').inspect(tree,
				//	{colors: true, depth: null}).replace(/\'/g, ''));
			})();
		}

	}

	return dirTreeSync;
}();
