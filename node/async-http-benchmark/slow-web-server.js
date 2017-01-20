'use strict';

const http = require('http');

http.createServer((req, res) => {
	res.writeHead(200, {'content-type': 'text/html'});
	res.write('(1)thinking... ');
	setTimeout(() => {
		res.write('(2)thinking... ');
		setTimeout(() => {
			res.write('(3)thinking... ');
			setTimeout(() => {
				res.end('done.');
			}, 1000);
		}, 1000);
	}, 1000);
}).listen(process.env.PORT || 8000);
