const fs = require('fs');
const http = require('http');

const server = http.createServer((req, res) => {
	if (req.url === '/')
		return res.writeHead(200, {'content-type': 'text/html; charset=UTF-8'}),
			fs.createReadStream('./index.html').pipe(res);

	res.writeHead(200, {'content-type': 'text/html; charset=UTF-8'});
	res.end('<h1>Hello world [' + req.url + ']</h1>');
});

server.listen(3000, function() {
	console.log('listening on *:3000');
});
