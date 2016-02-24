// proxy-from.js

void function () {
	'use strict';

	var net = require('net');
	var os = require('os');
	var netIfs = os.networkInterfaces();

	var log = require('log-manager').setWriter(new require('log-writer')('proxy-%s.log')).getLogger();

	try { var configs = require('./local-configs'); }
	catch (e) { var configs = require('./configs'); }

	if (!configs)
		throw new Error('no configs {servicePort, serviceHost, forwardPort, forwardHost}!');

	log.setLevel(configs.logLevel || 'debug');
	log.info('node', process.version);

	configs.services.forEach(function (config) {

		if (!config)
			throw new Error('no config {servicePort, serviceHost, forwardPort, forwardHost}!');

		var servicePort = config.servicePort;
		var serviceHost = config.serviceHost;
		var forwardPort = config.forwardPort;
		var forwardHost = config.forwardHost;

		if (!servicePort || !serviceHost || !forwardPort || !forwardHost)
			throw new Error('no config {servicePort, serviceHost, forwardPort, forwardHost}!');

		var checked = false;
		Object.keys(netIfs).map(i => netIfs[i]);

		var liveConnections = 0;
		if (!config.connectionId) config.connectionId = 10000;
		var connectionId = config.connectionId;

		// server 'connection'
		var server = net.createServer(
				{allowHalfOpen:true},
				function connectionServer(s) {

			++liveConnections;
			++connectionId;
			if (connectionId > config.connectionId + 9999) connectionId = config.connectionId;
			log.trace('(' + liveConnections + ')#' + connectionId + ' s connected');

			var c = net.createConnection(
					{port: forwardPort,
					 host: forwardHost,
					 localAddress: serviceHost},
					function connectionRemote() {

				log.trace('(' + liveConnections + ')#' + connectionId + ' c connected');

			});

			c.on('error', makeError('c err:'));
			s.on('error', makeError('s err:'));
			s.on('end', function endConnection() {
				--liveConnections;
				log.trace('(' + liveConnections + ')#' + connectionId + ' s end');
			});
			c.on('end', function endConnection() {
				log.trace('(' + liveConnections + ')#' + connectionId + ' c end');
			});
			c.pipe(s);
			s.pipe(c);

			function makeError(msg) {
				return function error(err) {
					log.warn('(' + liveConnections + ')#' + connectionId, msg, err);
					--liveConnections;
					c.destroy();
					s.destroy();
					//c.end();
					//s.end();
				};
			}

		});

		// server 'error'
		server.on('error', function errorServer(err) {
			log.warn('server err:', err);
		});

		// server listen
		server.listen(servicePort, function listeningServer() {
			log.info('service port: %s listening...', servicePort);
		});

	}); // services.forEach

}();
