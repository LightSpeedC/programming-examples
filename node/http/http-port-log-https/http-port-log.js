// http-port-log

(function () {
	'use strict';

	var http = require('http');
	var https = require('https');
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

		// 0:不明, 1:要求, 2:応答
		var MODE_UNKNOWN = 0;
		var MODE_REQUEST = 1;
		var MODE_RESPONSE = 2;

		var server = http.createServer((req1, res1) => aa(function *() {
			var dt = DateTime.toDateTimeString().replace(/[\-:]/g, '').replace(/[\. ]/g, '-');
			//console.log(dt);
			console.log('要求====================================', req1.method, req1.url);
			var mode = MODE_UNKNOWN;

			var chanSync = aa.Channel(); // 送受信の同期用

			var u = req1.url;
			if (u === '/') u = '/root';
			var file = './logs/' + dt + '-' + req1.method.toLowerCase() + u.replace(/[^0-9a-zA-Z]/g, '-') + '.log';
			var writer = fs.createWriteStream(file, {encoding: 'utf8'});

			aa(function *() {
				yield chanSync; // 要求または応答の終わり1/2
				yield chanSync; // 要求または応答の終わり2/2
				writer.end();
			});

			if (mode !== MODE_REQUEST) {
				console.log('要求');
				writer.write('ここから要求!--------------------' + CRLF + CRLF);
				mode = MODE_REQUEST;
			}

			writer.write(req1.method + ' ' + req1.url + CRLF);
			for (var i in req1.headers)
				writer.write(i + ': ' + req1.headers[i] + CRLF);
			writer.write(CRLF + CRLF);

			req1.headers.host = config.forwardHost + ':' + config.forwardPort;
			writer.write('host: ' + req1.headers.host + CRLF);
			writer.write(CRLF + CRLF);

			//var x = url.parse(req1.url);
			//console.log(x);

			var opt = {host: config.forwardHost, port: config.forwardPort,
						path: req1.url, method: req1.method, headers: req1.headers};
			var req2 = http.request(opt, (res2) => aa(function *() {
				if (mode !== MODE_RESPONSE) {
					mode = MODE_RESPONSE;
					console.log('応答');
					writer.write(CRLF + CRLF + 'ここから応答!--------------------' + CRLF + CRLF);
				}

				writer.write(res2.statusCode + ' ' + res2.statusMessage + CRLF);
				for (var i in res2.headers)
					writer.write(i + ': ' + res2.headers[i] + CRLF);
				writer.write(CRLF + CRLF);

				res1.writeHead(res2.statusCode, res2.headers);
				//res2.pipe(res1);
				var buff, chan = Channel().stream(res2);
				while (buff = yield chan) {
					if (mode !== MODE_RESPONSE) {
						mode = MODE_RESPONSE;
						console.log('応答');
						writer.write(CRLF + CRLF + 'ここから応答!--------------------' + CRLF + CRLF);
					}
					res1.write(buff);
					writer.write(buff);
				}
				res1.end();
				writer.write(CRLF + CRLF + '応答はここまで!####################' + CRLF + CRLF);
				chanSync('res2.end');
			}));

			//req1.pipe(req2);
			var buff, chan = Channel().stream(req1);
			while (buff = yield chan) {
				if (mode !== MODE_REQUEST) {
					mode = MODE_REQUEST;
					console.log('要求');
					writer.write(CRLF + CRLF + 'ここから要求!--------------------' + CRLF + CRLF);
				}
				req2.write(buff);
				writer.write(buff);
			}
			req2.end();
			writer.write(CRLF + CRLF + '要求はここまで!####################' + CRLF + CRLF);
			chanSync('req1.end');

		})).listen(config.servicePort, () => {
			console.log('listen started port:', config.servicePort);
		});
	});

})();
