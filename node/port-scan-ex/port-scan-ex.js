// port-scan

(function () {
	'use strict';

	var aa = require('aa');

	var host = process.argv[2] || 'localhost';

	console.log((new Date).toLocaleString() + ' starting...');

	var netIf = require('os').networkInterfaces();
	console.log(Object.keys(netIf).map(x=>netIf[x].filter(y=>y.address.indexOf('::')<0).map(y=>[x,y.address])));

	var net = require('net');
	process.on('uncaughtException', (err) =>
		console.log((new Date).toLocaleString() + ' uncaughtException: ' + err));

	aa(function *() {

		var time1 = new Date() - 0;

		for (var port = 80; port < 10000; ++port) {

			if (port % 100 === 0 && new Date() - time1 > 1000) {
				time1 = new Date() - 0;
				console.log((new Date).toLocaleString() + ' port:' + port);
			}

			if (port % 10 === 0) yield aa.wait(0);

			((port) => {
				var server = net.createServer(function (conn) {
					console.log((new Date).toLocaleString() + ' port:' + port + ' connected');
					conn.end();
				});
				server.on('error', function (err) {
					console.log((new Date).toLocaleString() + ' port:' + port + ' error: ' + err);
				});
				try {
					server.listen(port, host, 1, function () {
						//console.log('port:' + port + ' listening');
						server.close();
					})
				} catch (err) {
					console.log((new Date).toLocaleString() + ' port:' + port + ' NG: ' + err);
				}
			}) (port);

		} // for port

		console.log((new Date).toLocaleString() + ' wating... 1 seconds');
		yield aa.wait(1000)
		console.log((new Date).toLocaleString() + ' process exit.');
		//process.exit();

	}); // aa

})();
