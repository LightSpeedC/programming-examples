// net-port-log

(function () {
	'use strict';

	var net = require('net');
	var url = require('url');
	var fs = require('fs');
	var aa = require('aa'), thunkifyAll = aa.thunkifyAll, Channel = aa.Channel;
	var DateTime = require('date-time-string');
	console.log(DateTime.toDateTimeString());
	var CRLF = '\r\n';

	aa(function *() {

		var config = require('./net-port-log-config.json');
		thunkifyAll(fs, {suffix: 'A'});

		if (!(yield fs.existsA('./logs')))
			try { yield fs.mkdirA('./logs'); }
			catch (e) { console.log(e + ''); }

		// 0:不明, 1:要求, 2:応答
		var MODE_UNKNOWN = 0;
		var MODE_REQUEST = 1;
		var MODE_RESPONSE = 2;

		var server = net.createServer((soc1) => aa(function *() {
			var dt = DateTime.toDateTimeString().replace(/[\-:]/g, '').replace(/[\. ]/g, '-');
			//console.log(dt);
			console.log('要求====================================');
			var mode = MODE_UNKNOWN;

			var chanSync = aa.Channel(); // 送受信の同期用

			var file = './logs/' + dt + '.log';
			var writer = fs.createWriteStream(file, {encoding: 'utf8'});

			aa(function *() {
				yield chanSync; // 要求または応答の終わり1/2
				yield chanSync; // 要求または応答の終わり2/2
				writer.end();
			});

			if (mode !== MODE_REQUEST) {
				mode = MODE_REQUEST;
				console.log('要求');
				writer.write('ここから要求!--------------------' + CRLF + CRLF);
			}

			var soc2 = net.connect(config.forwardPort, config.forwardHost, () => aa(function *() {
				//soc2.pipe(soc1);
				var buff, chan = Channel().stream(soc2);
				while (buff = yield chan) {
					if (mode !== MODE_RESPONSE) {
						mode = MODE_RESPONSE;
						console.log('応答');
						writer.write(CRLF + CRLF + 'ここから応答!--------------------' + CRLF + CRLF);
					}
					soc1.write(buff);
					writer.write(buff);
				}
				soc1.end();
				writer.write(CRLF + CRLF + '応答はここまで!####################' + CRLF + CRLF);
				chanSync('soc2.end');
			}));

			//soc1.pipe(soc2);
			var buff, chan = Channel().stream(soc1);
			while (buff = yield chan) {
				if (mode !== MODE_REQUEST) {
					mode = MODE_REQUEST;
					console.log('要求');
					writer.write(CRLF + CRLF + 'ここから要求!--------------------' + CRLF + CRLF);
				}
				soc2.write(buff);
				writer.write(buff);
			}
			soc2.end();
			writer.write(CRLF + CRLF + '要求はここまで!####################' + CRLF + CRLF);
			chanSync('soc1.end');

		})).listen(config.servicePort, () => {
			console.log('listen started port:', config.servicePort);
		});
	});

})();
