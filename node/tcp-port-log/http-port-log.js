// http-port-log

(function () {
	'use strict';

	var http = require('http');
	var url = require('url');
	var fs = require('fs');
	var aa = require('aa'), thunkifyAll = aa.thunkifyAll, Channel = aa.Channel;
	var DateTime = require('date-time-string');
	console.log(DateTime.toDateTimeString());
	var CRLF = '\r\n';

	aa(function *() {

		var config = require('./http-port-log-config.json');
		thunkifyAll(fs, {suffix: 'A'});

		if (!(yield fs.existsA('./logs')))
			try { yield fs.mkdirA('./logs'); }
			catch (e) { console.log(e + ''); }

		var server = http.createServer((req, res) => aa(function *() {
			var dt = DateTime.toDateTimeString().replace(/[\-:]/g, '').replace(/[\. ]/g, '-');
			//console.log(dt);
			console.log('request:', req.method, req.url);

			var u = req.url;
			if (u === '/') u = '/root';
			var file = './logs/' + dt + '-' + req.method.toLowerCase() + u.replace(/[^0-9a-zA-Z]/g, '-') + '.log';
			var writer = fs.createWriteStream(file, {encoding: 'utf8'});

			writer.write(req.method + ' ' + req.url + CRLF);
			for (var i in req.headers)
				writer.write(i + ': ' + req.headers[i] + CRLF);
			writer.write(CRLF + CRLF);

			req.headers.host = config.forwardHost + ':' + config.forwardPort;
			writer.write('host: ' + req.headers.host + CRLF);
			writer.write(CRLF + CRLF);

			//var x = url.parse(req.url);
			//console.log(x);

			var opt = {host: config.forwardHost, port: config.forwardPort,
						path: req.url, method: req.method, headers: req.headers};
			var req2 = http.request(opt, (res2) => aa(function *() {

				writer.write(res2.statusCode + ' ' + res2.statusMessage + CRLF);
				for (var i in res2.headers)
					writer.write(i + ': ' + res2.headers[i] + CRLF);
				writer.write(CRLF + CRLF);

				res.writeHead(res2.statusCode, res2.headers);
				//res2.pipe(res);
				var buff, chan = Channel().stream(res2);
				while (buff = yield chan) {
					res.write(buff);
					writer.write(buff);
				}
				res.end();
				writer.write(CRLF + CRLF + '応答はここまで' + CRLF + CRLF);
				writer.end();
			}));
			//req.pipe(req2);
			var buff, chan = Channel().stream(req);
			while (buff = yield chan) {
				req2.write(buff);
				writer.write(buff);
			}
			req2.end();
			writer.write(CRLF + CRLF + '要求はここまで' + CRLF + CRLF);

			//res.writeHead(200, {'Content-Type': 'text/plain'});
			//res.end('Hello World\n');
			//yield fs.writeFileA(file, dt + ' ' + req.method + ' ' + req.url + '\r\n');
		})).listen(config.servicePort, () => {
			console.log('listen started port:', config.servicePort);
		});
	});

})();
