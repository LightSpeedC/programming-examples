'use strict';

const http = require('http');
const co = require('co');
const sleep = msec => cb => setTimeout(cb, msec);

http.createServer((req, res) => co(function *() {
	res.writeHead(200, {'content-type': 'text/html'});
	res.write('(1)thinking... ');
	yield sleep(1000);
	res.write('(2)thinking... ');
	yield sleep(1000);
	res.write('(3)thinking... ');
	yield cb => setTimeout(cb, 1000);
	res.end('done.');
})).listen(process.env.PORT || 8000);
