void function () {
	const https = require('https');
	const http = require('http');
	const url = require('url');
	const fs = require('fs');

	fs.readFileSync('urls.txt').toString()
		.split('\n').filter(line => line)
		.map(line => url.parse(line.trim()))
		.map(x => {
			x.method = 'GET';
			var h = x.protocol === 'http:' ? http :
				x.protocol === 'https:' ? https : null;
			h.request(x, res => {
				var file = x.href.replace(/[:/]+/g, '-').replace(/-+$/, '');
				console.log(x.href, '\t', file);
				res.pipe(fs.createWriteStream(file + '.log'));
			}).end();
		});

}();
