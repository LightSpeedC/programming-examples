// nvm.js

(function () {
	'use strict';

	var fs = require('fs');
	var path = require('path');
	var exec = require('child_process').exec;
	var co = require('co');
	var cofs = require('co-fs');

	function co_exec(cmd, options) {
		return function (cb) {
			exec(cmd, options, function (err, stdout, stderr) {
				cb(err, {stdout: stdout, stderr: stderr});
			});
		};
	}

	// var config = require(path.resolve(__dirname, 'config.json'));
	// var cfg_entry = config.cfg_entry;

	var node_root = path.resolve(__dirname, '..');

	co(function *() {

		// fs.readdir
		var res = yield cofs.readdir(node_root);

		// fs.stat
		res = yield res.map(function (name) {
			var dir = path.resolve(node_root, name);
			return {name: name, dir: dir, stat: cofs.stat(dir)};
		});

		// filter isDirectory then fs.readdir
		res = yield res.filter(function (elem) {
			return elem.stat.isDirectory();
		}).map(function (elem) {
			return {name: elem.name, dir: elem.dir, dirs: cofs.readdir(elem.dir)};
		});

		// filter node.exe then exec it
		res = yield res.filter(function (elem) {
			return elem.dirs.indexOf('node.exe') >= 0;
		}).map(function (elem) {
			return {name: elem.name, dir: elem.dir,
				exec: co_exec('"' + path.resolve(elem.dir, 'node') +
					'" -p "process.version"') };
					//' -p "process.version+\' \'+process.arch+\' \'+process.platform"') };
		});

		var out = [];

		res = res.map(function (elem, i) {
			return {no: i, name: elem.name, dir: elem.dir,
				out: String(elem.exec.stdout).trim() + String(elem.exec.stderr).trim(),
				cmd: 'path ' + elem.dir + ';%path%'};
		}).forEach(function (elem) {
			if (process.argv[2]) {
				if (process.argv[2] == elem.no ||
						process.argv[2] === elem.out) {
					out.push(elem);
				}
			}
			else
				console.log(pad(elem.no, 2) + '  ' +
					pad(elem.out, -9) + '  ' +
					pad(elem.name, -20) + '  ' + elem.cmd);
		});

		yield cofs.writeFile(path.resolve(__dirname, 'nvm_out.cmd'),
			out.length ? '@' + out[0].cmd + '\r\n@node -v': '');

		//console.log(JSON.stringify(res, null, '  '));

	}).catch(function (err) { console.log(err+''); });

	function pad(n, m) {
		return m < 0 ?
			(n + '                                        ').slice(0, -m) :
			('                                        ' + n).slice(-m);
	}

})();
