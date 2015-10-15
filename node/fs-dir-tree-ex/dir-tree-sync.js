// dir-tree-sync.js

this.dirTreeSync = function () {
	'use strict';

	var fs = require('fs');
	var path = require('path');
	var $totalsize = '*totalsize*';
	//var $dirsize = '*dirsize*';

	function dirTreeSync(dir) {
		if (!dir) dir = '.';
		dir = path.resolve(dir);

		try {
			var names = fs.readdirSync(dir);
		} catch (err) {
			console.log(err.stack);
			return null;
		}
		var totalsize = 0;
		var children = {};
		for (var i = 0, n = names.length; i < n; ++i) {
			var name = names[i];
			var file = path.resolve(dir, name);
			try {
				var stat = fs.statSync(file);
			} catch (err) {
				console.log(err.stack);
				children[name] = null;
				continue;
			}
			var size = stat.size;
			var child = stat.isDirectory() ? dirTreeSync(file) : null;
			children[name] = child ? child : size;
			totalsize += size + (child ? child[$totalsize] : 0);
		}
		children[$totalsize] = totalsize;
		return children;

		//var children = [];
		//for (var i = 0, n = names.length; i < n; ++i) {
		//  var name = names[i];
		//  var file = path.resolve(dir, name);
		//  var stat = fs.statSync(file);
		//  var size = stat.size;
		//  var child = stat.isFile() ? null : dirTreeSync(file);
		//  children.push(child ?
		//    {name: name, child: child} :
		//    {name: name, size: size});
		//  totalsize += size + (child ? child.totalsize : 0);
		//}
		//return {totalsize: totalsize, children: children};
	}

	dirTreeSync.dirTreeSync = dirTreeSync;

	// node.js module.exports
	if (typeof module === 'object' && module && module.exports) {
		module.exports = dirTreeSync;

		// main
		if (require.main === module) {
			var tree = dirTreeSync(process.argv[2]);
			console.log(require('util').inspect(tree,
				{colors: true, depth: null}).replace(/\'/g, ''));
		}
	}

	return dirTreeSync;
}();
