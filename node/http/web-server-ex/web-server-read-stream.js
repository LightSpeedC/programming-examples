	if (!String.prototype.endsWith)
		String.prototype.endsWith = function endsWith(str) {
			return this.substr(-str.length) === str;
		};
	var port = process.argv[2] || 8080;
	//var mimes = {'.html': 'text/html', '.js': 'text/javascript'};
	var mimes = require('./mime-types.json');
	var fs = require('fs');
	var util = require('util');
	var path = require('path');
	var http = require('http');
	var dirnameRex = RegExp((__dirname + '\\').replace(/\\/g, '(/|\\\\\\\\?)'), 'g');
	http.createServer(function (req, res) {
		var file = req.url;
		if (file === '/echo') {
			console.log('--:', req.method, req.url);
			res.writeHead(200, {'content-type': 'application/json'});
			req.pipe(res);
			return;
		}

		if (file.endsWith('/')) file += 'index.html';
		file = path.join(__dirname, file);
		console.log('--:', req.method, req.url, file.replace(dirnameRex, '?/'));
		res.writeHead(200, {'content-type': mimes[path.extname(file)] || 'text/plain'});
		//res.statusCode = 200;
		//res.setHeader('content-type', mimes[path.extname(file)] || 'text/plain');
		var r = fs.createReadStream(file);
		r.pipe(res);
		r.on('error', function (err) {
			console.error('NG:', req.method, req.url, file.replace(dirnameRex, '?/'));
			console.error('NG:', util.inspect(err, {colors:true}).replace(dirnameRex, '?/'));
			res.writeHead(404, {'content-type': 'text/html'});
			res.write('<h1>404 ' + http.STATUS_CODES[404] + '</h1>\n');
			res.end('<pre>' + util.inspect(err).replace(dirnameRex, '?/') + '</pre>');
		});
		r.on('end', function () {
			console.log('OK:', req.method, req.url, file.replace(dirnameRex, '?/'));
		});

	}).listen(port, function () {
		console.log('listen start...');
	});
