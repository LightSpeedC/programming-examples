// ES6 stream.

	var fs = require('fs');
	var aa = require('aa'), Channel = aa.Channel;

	aa(function *main() {
		var chan = Channel().stream(fs.createReadStream('es6-stream-ex.js', {encoding: 'utf8'}));
		var writer = fs.createWriteStream('es6-stream-ex.log', {encoding: 'utf8'})

		var buff;
		while (buff = yield chan)
			writer.write(buff);
		writer.end();
	});
