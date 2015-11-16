(function () {
	'use strict';

	var aa = require('aa'), thunkify = aa.thunkify;
	var fs = require('fs');
	var path = require('path');
	var util = require('util');
	var Executors = require('executors');
	var DateTime = require('date-time-string');
	var fs_readdir = thunkify(fs.readdir);
	var fs_stat =    thunkify(fs.stat);
	var fs_exists =  thunkify(fs.exists);
	var child_process_exec = thunkify(require('child_process').exec);

	var COLOR_OK     = '\x1b[32m';
	var COLOR_ERROR  = '\x1b[41m';
	var COLOR_WARN   = '\x1b[33m';
	var COLOR_NORMAL = '\x1b[m';
	var COLOR_AHEAD  = '\x1b[35m';

	var N = 7;
	var cd = 'cd ' + (process.platform === 'win32' ? '/d ' : '');

	var dttm = DateTime.toDateTimeString().replace(/[\-:]/g, '').replace(/ /g, '-').substr(0, 13);

	// main
	aa(function* main() {
		var executor = Executors(N);
		var testMode = process.argv[3] === 'test';
		var dir = path.resolve(process.argv[2] || '.');
		var w = require('fs').createWriteStream(
			path.resolve(dir, 'git-pull-' + dttm + '.log'), {encoding: 'utf8'});

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

			if (names.indexOf('.git') >= 0) {
				log('Git ===> ' + dir);
				if (yield fs_exists(path.resolve(dir, '.git/ORIG_HEAD.lock')))
					return error('*** ' + dir + '\n' + COLOR_WARN + 'SKIPPED (ORIG_HEAD.lock)!!!' + COLOR_NORMAL);
				try {
					if (testMode)
						return log('*** ' + dir + ' --- test');
					var res = yield executor(child_process_exec, cd + dir + ' & git status & git pull');
					res = res.map(unescape);
					if (res[0].indexOf('use "') === -1) {
						if (res[0].replace(/\r\n/g, '\n') ===
							"On branch master\n" +
							"Your branch is up-to-date with 'origin/master'.\n\n" +
							"nothing to commit, working directory clean\n" +
							"Already up-to-date.\n")
							log('*** ' + dir + ' ===> ' + COLOR_OK + 'OK' + COLOR_NORMAL);
						else
							log('*** ' + dir + '\n' + COLOR_OK + res[0] + COLOR_NORMAL);
					}
					else
						log('*** ' + dir + '\n' + COLOR_AHEAD + res[0] + COLOR_NORMAL);
					res[1] && error(COLOR_WARN + res[1] + COLOR_NORMAL);
				} catch (e) {
					error('*** ' + dir + '\n' + COLOR_ERROR +
						util.inspect(e, {colors:true, depth:null}) + COLOR_NORMAL);
				}
				return;
			} // names contains '.git'

			yield names.map(name => function *() {
				if (name === 'node_modules') return;
				var file = path.resolve(dir, name);
				if ((yield fs_stat(file)).isDirectory())
					yield tree(file);
			}); // names.map

		} // tree

	}); // aa(main)

	function unescape(s) {
		var t = s.replace(/(\r)|(\n)|(\')|\\(x(..)|(\d\d\d))/g,
			function (match, r, n, sq, xo, x, o, offset, string) {
				return x ? '\\x' + x :
					o ? '\\x' + ('0' + parseInt(o,8).toString(16)).substr(-2,2) :
					sq ? "\\'" :
					r ? '\\r' :
					n ? '\\n' :
					string;
			});
		return new Buffer(eval("'" + t + "'"), 'binary').toString();
	}

})();
