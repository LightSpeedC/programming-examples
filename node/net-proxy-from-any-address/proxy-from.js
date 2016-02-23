// proxy-from.js

void function () {
	'use strict';

	var net = require('net');

	try { var configs = require('./local-configs'); }
	catch (e) { var configs = require('./configs'); }

	if (!configs ||
		!configs.servicePort ||
		!configs.serviceHost ||
		!configs.forwardPort ||
		!configs.forwardHost)
		throw new Error('no configs {servicePort, serviceHost, forwardPort, forwardHost}!');

	var servicePort = configs.servicePort;
	var serviceHost = configs.serviceHost;
	var forwardPort = configs.forwardPort;
	var forwardHost = configs.forwardHost;

	var isInfo = true;

	var liveConnections = 0;

	// server 'connection'
	var server = net.createServer(
			{allowHalfOpen:true},
			function connectionServer(s) {

		++liveConnections;
		if (isInfo) console.info('#(' + liveConnections + ') s connected');

		var c = net.createConnection(
				{port: forwardPort,
				 host: forwardHost,
				 localAddress: serviceHost},
				function connectionRemote() {

			if (isInfo) console.info('#(' + liveConnections + ') c connected');

		});

		c.on('error', makeError('c err:'));
		s.on('error', makeError('s err:'));
		s.on('end', function endConnection() { --liveConnections; });
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

	// server 'error'
	server.on('error', function errorServer(err) {
		console.error('server err:', err);
	});

	// server listen
	server.listen(servicePort, function listeningServer() {
		console.info('service port: %s listening...', servicePort);
	});

}();
