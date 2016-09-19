// client.js

const http = require('http');
http.request('http://localhost:3000', res => {
	console.log(res.rawHeaders
		.reduce((x, y, i, a) => i % 2 ? x : x += y + ': ' + a[i + 1] + '\n', ''));
	res.pipe(process.stdout);
}).end();
