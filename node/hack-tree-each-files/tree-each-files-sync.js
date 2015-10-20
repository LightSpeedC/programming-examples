// http://hack.aipo.com/archives/11249/

var fs = require('fs');

if (require.main === module) main();

function main () {
	var filepath = process.argv[2] || '.';
	eachFiles(filepath, filepath, function (filepath) {
		console.log(filepath);
	});
}

function eachFiles(filepath, rootPath, callback) {
	if (!rootPath) {
		rootPath = filepath;
	}
	var stat = fs.statSync(filepath);
	if (!stat) {

	} else if (stat.isDirectory()) {
		try {
			var files = fs.readdirSync(filepath);
			if (!files) {

			} else {
				for (var _i in files)(function (i) {
					var file = files[i];
					if (filepath.match(/.*\/$/)) {
						eachFiles(filepath + file, rootPath, callback);
					} else {
						eachFiles(filepath + "/" + file, rootPath, callback);
					}
				}(_i));
			}
		} catch (e1) {
			console.error("Directory " + filepath + " is unreadable.");
		}
	} else if (stat.isFile()) {
		if (callback) {
			callback.call(this, filepath, rootPath);
		}
	} else {
		console.error(filepath + " is not file or directory");
	}
}
