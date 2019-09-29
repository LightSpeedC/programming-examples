// dir-tree-sync.js

this.dirTreeSync = function () {
	'use strict';

	const fs = require('fs');
	const path = require('path');
	const errorValue = '';

	// dirTreeSync(dir)
	function dirTreeSync(dir, level) {
		if (level < 1) return errorValue;

		try {
			const names = fs.readdirSync(dir);
			const children = {};

			names.forEach(name => children["'" + name] = errorValue);

			names.forEach(name => {
				const file = path.resolve(dir, name);
				try {
					const stat = fs.statSync(file);
					children["'" + name] = stat.isDirectory() ? dirTreeSync(file, level - 1) : errorValue;
				} catch (err) {
					console.log(err.stack);
					return;
				}
			});

			return children;

		} catch (err) {
			console.log(err.stack);
			return null;
		}

	} // dirTreeSync

	// node.js module.exports
	if (typeof module === 'object' && module && module.exports) {
		module.exports = dirTreeSync;

		// main
		if (require.main === module) {
			(() => {
				console.time('sync');
				const dir = path.resolve(process.argv[2] || '.');
				const level = Number(process.argv[3] || 3);
				const tree = dirTreeSync(dir, level);
				console.timeEnd('sync');
				console.log(JSON.stringify(tree, null, '\t').replace(/\"/g, ''));
				//console.log(require('util').inspect(tree,
				//	{colors: false, depth: null}).replace(/\'/g, ''));
			})();
		}

	}

	return dirTreeSync;
}();
