(function () {
	'use strict';

	var aa = require('aa'), thunkify = aa.thunkify;
	var fs = require('fs');
	var path = require('path');
	var util = require('util');
	var Executors = require('executors');
	var DateTime = require('date-time-string');
	var fs_readdir =  thunkify(fs.readdir);
	var fs_stat =     thunkify(fs.stat);
	var fs_exists =   thunkify(fs.exists);
	var fs_readFile = thunkify(fs.readFile);
	//var child_process_exec = thunkify(require('child_process').exec);

	var COLOR_OK     = '\x1b[32m';
	var COLOR_ERROR  = '\x1b[41m';
	var COLOR_WARN   = '\x1b[33m';
	var COLOR_NORMAL = '\x1b[m';
	var COLOR_AHEAD  = '\x1b[35m';

	var N = 10;

	var dttm = DateTime.toDateTimeString().replace(/[\-:]/g, '').replace(/ /g, '-').substr(0, 13);

	// main
	aa(function* main() {
		var executor = Executors(N);
		var testMode = process.argv[3] === 'test';
		var dir = path.resolve(process.argv[2] || '.');
		var w = fs.createWriteStream(
			path.resolve(dir, 'package-versions-' + dttm + '.log'), {encoding: 'utf8'});

		var rex = RegExp('\x1b\\[.*?m', 'g')
		function log(x)   { console.log(x);   w.write(x.replace(rex, '') + '\r\n'); }
		function error(x) { console.error(x); w.write(x.replace(rex, '') + '\r\n'); }

		yield tree(dir);
		yield executor.end();
		log('all finished!');
		return;

		// tree
		function* tree(dir) {
			var names = yield fs_readdir(dir);

			if (names.indexOf('package.json') >= 0) {
				//log('npm package.json ===> ' + dir);
				var file = path.resolve(dir, 'package.json');
				try {
					if (testMode)
						return log('*** ' + dir + ' --- test');
					var buff = yield executor(fs_readFile, file);
					var pkg = JSON.parse(buff.toString());
					log('*** ' + dir.replace(/node_modules/g, '(#)') + '\n' + COLOR_OK +
						pkg.name + '@' + pkg.version + COLOR_NORMAL);
				} catch (e) {
					error('*** ' + dir + '\n' + COLOR_ERROR + e.stack + '\n' +
						util.inspect(e, {colors:true, depth:null}) + COLOR_NORMAL);
				}
				//return;
			} // names contains '.git'

			yield names.map(name => function *() {
				//if (name === 'node_modules') return;
				var file = path.resolve(dir, name);
				if ((yield fs_stat(file)).isDirectory())
					yield tree(file);
			}); // names.map

		} // tree

	}); // aa(main)

})();
