'use strict';
const http = require('http'), fs = require('fs'), path = require('path');
[8001, 8002].forEach(port =>
	http.createServer((req, res) => {
		const resErr = err =>
			res.end(('error: ' + err).replace(__dirname, ''));
		const file = path.join(__dirname, req.url);
		console.log(req.method, req.url);
		fs.stat(file, (err, stat) =>
			err ? resErr(err) :
			stat.isDirectory() ?
				fs.readdir(file, (err, names) => {
					res.writeHead(200, {'content-type': 'text/html'});
					res.end('Directory: ' + req.url + '<br>\n' +
						names.map(x =>
						'<a href="' + path.join(req.url, x) + '">' +
							x + '</a><br>').join('\n'));
				}) :
			fs.createReadStream(file).pipe(res).on('error', resErr)
		);
	}).listen(port, () => console.log('port', port, 'started')));
