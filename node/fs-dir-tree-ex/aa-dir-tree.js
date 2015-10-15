// aa-dir-tree.js

this.dirTree = function () {
	'use strict';

	var aa = require('aa');
	var fs = require('co-fs');
	var path = require('path');
	var $totalsize = '*totalsize*';
	//var $dirsize = '*dirsize*';

	function *dirTree(dir) {
		if (!dir) dir = '.';
		dir = path.resolve(dir);

		try {
			var names = yield fs.readdir(dir);
		} catch (err) {
			return null;
		}

		var totalsize = 0;
		var dirsize = 0;
		var children = {};

		for (var i = 0, n = names.length; i < n; ++i) {
			var name = names[i];
			var file = path.resolve(dir, name);
			try {
				var stat = yield fs.stat(file);
			} catch (err) {
				console.log(err.stack);
				children[name] = null;
				continue;
			}
			var size = stat.size;
			var child = stat.isDirectory() ? yield dirTree(file) : null;
			children[name] = child ? child : size;
			totalsize += size + (child ? child[$totalsize] : 0);
			dirsize += size;
		}

		//children[$dirsize] = dirsize;
		children[$totalsize] = totalsize;
		return children;

		//var children = [];
		//for (var i = 0, n = names.length; i < n; ++i) {
		//  var name = names[i];
		//  var file = path.resolve(dir, name);
		//  var stat = yield fs.stat(file);
		//  var size = stat.size;
		//  var child = stat.isDirectory() ? yield dirTree(file) : null;
		//  children.push(child ?
		//    {name: name, child: child} :
		//    {name: name, size: size});
		//  totalsize += size + (child ? child.totalsize : 0);
		//  dirsize += size;
		//}
		//return {totalsize: totalsize, dirsize: dirsize, children: children};
	}

	dirTree.dirTree = dirTree;

	// node.js module.exports
	if (typeof module === 'object' && module && module.exports) {
		module.exports = dirTree;

		// main
		if (require.main === module) {
			var tree = 
			aa(dirTree(process.argv[2] || '.')).then(function (tree) {
				console.log(require('util').inspect(tree,
					{colors: true, depth: null}).replace(/\'/g, ''));
			}, function (err) {
				console.log(err.stack);
			});
		}

	}

	return dirTree;
}();
