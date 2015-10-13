(function () {
	'use strict';

	var aa = require('aa'), chan = aa.chan, thunkify = aa.thunkify;
	var fs = require('fs');
	var path = require('path');
	var util = require('util');
	var Executors = require('executors');
	var fs_readdir = thunkify(fs.readdir);
	var fs_stat =    thunkify(fs.stat);
	var fs_exists =  thunkify(fs.exists);
	var child_process_exec = thunkify(require('child_process').exec);

	var COLOR_OK     = '\x1b[32m';
	var COLOR_ERROR  = '\x1b[41m';
	var COLOR_WARN   = '\x1b[33m';
	var COLOR_NORMAL = '\x1b[m';

	var N = 5;
	var cd = 'cd ' + (process.platform === 'win32' ? '/d ' : '');

	// main
	aa(function* main() {
		var executor = Executors(N);
		yield tree(path.resolve(process.argv[2] || '.'));
		yield executor.end();
		console.log('all finished!');
		return;

		// tree
		function* tree(dir) {
			var names = yield fs_readdir(dir);

			if (names.indexOf('.git') >= 0) {
				console.log('Git ===> ', dir);
				if (yield fs_exists(path.resolve(dir, '.git/ORIG_HEAD.lock')))
					return console.error('*** ' + dir + '\n' + COLOR_WARN + 'SKIPPED (ORIG_HEAD.lock)!!!' + COLOR_NORMAL);
				try {
					var res = yield executor(child_process_exec, cd + dir + ' & git status & git pull');
					console.log('*** ' + dir + '\n' + COLOR_OK + res[0] + COLOR_NORMAL);
					res[1] && console.error(COLOR_WARN + res[1] + COLOR_NORMAL);
				} catch (e) {
					console.error('*** ' + dir + '\n' + COLOR_ERROR +
						util.inspect(e, {colors:true, depth:null}) + COLOR_NORMAL); }
				return;
			} // names contains '.git'

			yield names.map(name => function *() {
				if (name === 'node_modules') return;
				var file = path.resolve(dir, name);
				if ((yield fs_stat(file)).isDirectory())
					yield tree(path.resolve(dir, name));
			}); // names.map

		} // tree

	}); // aa(main)

})();
