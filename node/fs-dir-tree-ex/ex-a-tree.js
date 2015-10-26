(function () {
	'use strict';

	var fs = require('fs');
	var path = require('path');
	var aa = require('aa'), thunkify = aa.thunkify;
	var fs_readdir = thunkify(fs.readdir);
	var fs_stat    = thunkify(fs.stat);

	function *tree(dir) {
		console.log(dir);
		var names = yield fs_readdir(dir);
		if (names.indexOf('.git') >= 0)
			return console.log('.git:', dir, ' - ', yield *someProcessAsync());
		var obj = names.reduce((obj, name) => (obj[name] = null, obj), {});
		yield names.map(name => function *() {
			var stat, file = path.resolve(dir, name);
			if ((stat = yield fs_stat(file)).isDirectory())
				obj[name] = yield *tree(file);
			else	obj[name] = stat.size;
		});
		return obj;
	}

	var parallelCounter = 0;
	function *someProcessAsync() {
		var startTime = new Date;
		++parallelCounter;
		yield aa.wait(1000);
		return (new Date - startTime) + ' msec (' +
			--parallelCounter + ')';
	}

	aa(tree(path.resolve('.'))).then(obj => console.log('%j', obj));
})();
