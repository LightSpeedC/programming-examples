// proxy-from.js

void function () {
	'use strict';

	var net = require('net');
	var configs = require('./configs');
	var servicePort = configs.servicePort || 8001;
	var serviceHost = configs.serviceHost || '127.0.0.1';
	var forwardPort = configs.forwardPort || 8002;
	var forwardHost = configs.forwardHost || 'localhost';

	var isInfo = true;

	var server = net.createServer({allowHalfOpen:true},
			function connection(s) {

		if (isInfo) console.info('s connected');
		var c = net.createConnection(
				{port: forwardPort, host: forwardHost, localAddress: serviceHost},
				function () {
			if (isInfo) console.info('c connected');
		});
		c.on('error', makeError('c err:'));
		s.on('error', makeError('s err:'));
		c.pipe(s);
		s.pipe(c);

		function makeError(msg) {
			return function error(err) {
				console.error(msg, err);
				c.destroy();
				s.destroy();
			};
		}

	});
	server.on('error', function (err) { console.error('server err:', err); });
	server.listen(servicePort, function listening() {
		console.info('service port: %s listening...', servicePort);
	});

}();
