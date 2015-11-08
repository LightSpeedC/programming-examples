var fs = require('fs');
var path = require('path');
var chalk = require('chalk');

dirTreeSync(process.argv[2] || '.');

function dirTreeSync(dir) {
	try {
		var stat = fs.statSync(dir);
	} catch (e) {
		console.error(chalk.red('stat: ' + e));
		return;
	}
	if (stat.isDirectory()) {
		try {
			var files = fs.readdirSync(dir);
			files.forEach(file => dirTreeSync(path.resolve(dir, file)));
		} catch (e) {
			console.error(chalk.red('read: ' + e));
		}
	}
	else if (stat.isFile())
		; //console.log(chalk.green('File: ' + dir));
	else
		console.error(chalk.yellow('file? dir? ' + dir));
}
