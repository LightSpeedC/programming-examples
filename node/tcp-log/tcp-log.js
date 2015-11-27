void function() {
	'use strict';

	var net = require('net');
	var fs = require('fs');

	var settings = require('./settings.json');

	var DateTime = require('./date-time-string').extendDateToDateTimeString();
	try { fs.mkdirSync('logs'); }
	catch (e) { if (e.code !== 'EEXIST') throw e; }

	var seq = 0;

	settings.forEach(startService);

	function startService(setting) {

		var server = net.createServer(function (soc1) {
			console.log('soc1 connected!');

			var dt = DateTime.toDateTimeString().replace(/[-:]/g, '').replace(/[ .]/g, '-');
			var w = null;
			//fs.createWriteStream(dt + '-' + (++seq) + '-' + setting.log_file);
			var n = 2;
			var mode = -1;

			function setmode(m) {
				if (mode !== m) {
					if (w) w.end();
					w = fs.createWriteStream(
						'logs/' +
						dt + '-' + ('000' + ++seq).substr(-4) + '-' + m + '-' +
						setting.log_file);
				}
				mode = m;
			}

			var soc2 = net.createConnection(setting, function () {
				console.log('soc2 connected!');
			});

			soc1.on('readable', function () {
				var buff = soc1.read();
				if (!buff) return;
				soc2.write(buff);
				setmode('send');
				w.write(buff);
			});
			soc1.on('end', function () {
				if (--n === 0) end();
				// --n || end();
			});
			soc1.on('error', function (err) {
				console.log('soc1: ' + err.stack);
				setmode('err1');
				w.write('soc1: ' + err.stack + '\r\n\r\n');
			});

			soc2.on('readable', function () {
				var buff = soc2.read();
				if (!buff) return;
				soc1.write(buff);
				setmode('recv');
				w.write(buff);
			});
			soc2.on('end', function () {
				if (--n === 0) end();
				// --n || end();
			});
			soc2.on('error', function (err) {
				console.log('soc2: ' + err.stack);
				setmode('err2');
				w.write('soc2: ' + err.stack + '\r\n\r\n');
			});

			function end() {
				soc1.end();
				soc2.end();
				if (w) w.end();
			}

		});

		server.listen(setting.service_port);
	}

}();
