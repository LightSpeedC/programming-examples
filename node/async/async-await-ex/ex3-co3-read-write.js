var fs = require('fs');

thread(function *() {
	try {
		var str = yield read('README.md');
	} catch (err) {
	}
	str = str.replace('Something', 'Else');
	yield write('README.md', str);
	console.log('end');
});

function read(file) {
	return callback => fs.readFile(file, 'utf8', callback);
}

function write(file, str) {
	return callback => fs.writeFile(file, str, callback);
}

function thread(fn) {
	var gen = fn();
	next();
	function next(err, val) {
		var ret = gen.next(val);
		if (ret.done) return;
		ret.value(next);
	}
}
