const fs = require('fs');

const listAllFiles = file => [].concat.apply([],
	fs.statSync(file).isDirectory() ?
		fs.readdirSync(file).map(nm => file + '/' + nm)
			.map(listAllFiles) : [file]);

console.log(listAllFiles('.'));
