void function () {
	/*
	const https = require('https');
	const http = require('http');
	const url = require('url');
	const fs = require('fs');
	const os = require('os');
	*/
	const [https, http, url, fs, os] =
		['https', 'http', 'url', 'fs', 'os']
		.map(require);

	fs.readFileSync('urls.txt').toString()
		.split('\n').filter(line => line)
		.map(line => url.parse(line.trim()))
		.map(x => {
			x.method = 'GET';
			const h = x.protocol === 'http:' ? http :
				x.protocol === 'https:' ? https : null;
			h.request(x, res => {
				const file = x.href.replace(/[:/]+/g, '-').replace(/-+$/, '');
				console.log(x.href, '\t', file);
				res.pipe(fs.createWriteStream(file + '.body.log'));
				const keys = Object.keys(res.headers);
				const headers =
					['HTTP', res.statusCode, res.statusMessage].join(' ') +
					os.EOL +
					keys.map(p => {
					const v = res.headers[p];
					if (v.constructor === Array)
						return v.map(v => p + ': ' + v).join(os.EOL);
					return p + ': ' + v;
				}).join(os.EOL) + os.EOL;
				fs.writeFile(file + '.head.log', headers,
					err => err ? console.error(err) : 0);
			}).end();
		});
} ();
