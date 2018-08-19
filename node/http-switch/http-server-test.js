// http-server-test.js

'use strict';

const fs = require('fs');
const util = require('util');
const http = require('http');
const port = 8000;

http.createServer((req, res) => {
	console.log(req.method, req.url);
	res.writeHead(200, {
		'Content-Type': 'text/html; charset=UTF-8',
	});
	res.write('port: ' + port + ' ' + req.method + ' ' + req.url + '<br/>\r\n');
	res.write('<pre>' + util.inspect(req.headers) + '</pre>\r\n');
	req.on('data', data => {
		res.write(data);
	});
	req.on('end', () => {
		res.end();
	});
	req.on('error', err => { console.log(err); });
})
.listen(port, () => {
	console.log('http server listen ready. port:', port);
});
