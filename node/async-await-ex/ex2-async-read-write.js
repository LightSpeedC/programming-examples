var fs = require('fs');

readAndWrite(() => console.log('end'));

function readAndWrite(callback) {
	read('README.md', function(err, str){
		throw new Error('oh no, reference error etc');
		if (err) return callback(err);
		str = str.replace('Something', 'Else');
		write('README.md', str, callback);
	});
}
function read(file, callback) {
	fs.readFile(file, 'utf8', callback);
}
function write(file, str, callback) {
	fs.writeFile(file, str, callback);
}
