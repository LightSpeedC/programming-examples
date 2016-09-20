const http = require('http');
const url = require('url');

const list = [{method:'GET', uri:'http://localhost:3000'}];

list.forEach(x => {
	const opts = url.parse(x.uri);
	opts.method = x.method;
	const req = http.request(opts, res => {
		console.log('\x1b[33mGET ' + x.uri);
		console.log('\x1b[36mHTTP ' +
			res.statusCode + ' ' +
			res.statusMessage + '\n\x1b[32m' +
			res.rawHeaders.reduce((x, y, i, a) =>
				(i % 2 ? x : x += y + ': ' + a[i + 1] + '\n'), '')
			+ '\x1b[m');
		res.pipe(process.stdout);
	}).end();
});
