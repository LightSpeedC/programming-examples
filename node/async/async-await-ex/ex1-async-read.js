var fs = require('fs');

read('README.md', (err, val) => {
	console.log(val);
	sleep(1000, () =>
		read('package.json', (err, val) =>
			console.log(val)
		)
	);
});

function read(file, callback) {
	fs.readFile(file, 'utf8', callback);
}

function sleep(msec, callback) {
	setTimeout(callback, msec);
}
