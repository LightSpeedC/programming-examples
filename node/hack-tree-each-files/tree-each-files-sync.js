// http://hack.aipo.com/archives/11249/

var fs = require('fs');
var path = require('path');

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
	if (stat.isDirectory()) {
		try {
			var files = fs.readdirSync(filepath);
			files.forEach(file => {
				eachFiles(path.resolve(filepath, file), rootPath, callback);
			});
		} catch (e1) {
			console.error("Directory " + filepath + " is unreadable." + e1);
		}
	} else if (stat.isFile()) {
		if (callback) {
			callback.call(this, filepath, rootPath);
		}
	} else {
		console.error(filepath + " is not file or directory");
	}
}
