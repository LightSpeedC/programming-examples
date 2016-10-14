'use strict';
const http = require('http'), fs = require('fs'), path = require('path');
const co3 = gfn => cb => (gen =>
		function next(err, val) {
			try { var ret = err ? gen.throw(err) : gen.next(val); }
			catch(e) { if (cb) return cb(e); throw e; }
			ret.done ? cb && cb(null, ret.value) :
			typeof ret.value === 'function' ? ret.value(next) :
			ret.value && ret.value.then ?
				ret.value.then(val => next(null, val), next) :
			next(null, ret.value);
		} ())(gfn());

[8001, 8002].forEach(port =>
	http.createServer((req, res) => co3(function *() {
		const resErr = err =>
			res.end(('error: ' + err).replace(__dirname, ''));
		const file = path.join(__dirname, req.url);
		console.log(req.method, req.url);
		try {
			const stat = yield cb => fs.stat(file, cb);
			if (stat.isDirectory()) {
				const names = yield cb => fs.readdir(file, cb);
				res.writeHead(200, {'content-type': 'text/html'});
				res.end('Directory: ' + req.url + '<br>\n' +
					names.map(x =>
					'<a href="' + path.join(req.url, x) + '">' +
						x + '</a><br>').join('\n'));
			}
			else fs.createReadStream(file).pipe(res).on('error', resErr);
		} catch (e) { return resErr(e); }
	})()).listen(port, () => console.log('port', port, 'started')));
