(function () {
	'use strict';

	var fs = require('fs');
	var path = require('path');

	function tree(dir) {
		var names = fs.readdirSync(dir);
		if (names.indexOf('.git') >= 0)
			return console.log('.git:', dir, ' - ', someProcessSync());
		names.map(name => {
			var file = path.resolve(dir, name);
			if (fs.statSync(file).isDirectory())
				tree(file);
		});
	}

	function someProcessSync() {
		var startTime = new Date;
		waitSecondsSync(1);
		return (new Date - startTime) + ' msec';
	}

	tree(path.resolve('.'));

	function waitSecondsSync(sec) {
		sec = (Number(sec) | 0) || 1;
		var pingCmd = (process.platform === 'win32' ? 'ping -n ' : 'ping -c ') +
			(sec + 1) + ' localhost';
		require('child_process').execSync(pingCmd);
	}
})();
