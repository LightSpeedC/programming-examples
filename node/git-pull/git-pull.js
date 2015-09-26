(function () {
	'use strict';

	var aa = require('aa');
	var fs = require('fs');
	var path = require('path');
	var fs_readdir = aa(fs.readdir);
	var fs_stat = aa(fs.stat);

	aa(tree(path.resolve(process.argv[2] || '.')));

	function* tree(dir) {
		//console.log(':', dir);
		var names = yield fs_readdir(dir);
		if (names.indexOf('.git') >= 0) {
			console.log('Git ===> ', dir);
			//console.log(dir, names);
			return;
		}
		//console.log(names);
		yield names.map(name => function *() {
			//console.log(name);
			if (name === 'node_modules') return;
			var file = path.resolve(dir, name);
			var stat = yield fs_stat(file);
			if (stat.isDirectory()) {
				//console.log(file + '/');
				yield tree(path.resolve(dir, name));
			}
			//console.log(stat);
		});
	}

})();
