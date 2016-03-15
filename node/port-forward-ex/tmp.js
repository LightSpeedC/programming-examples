	var logFile = 'log/fwd-%s.log';
	var logLevel = 'debug';
	var log = require('log-manager').setWriter(new require('log-writer')(logFile)).getLogger();
	log.setLevel(logLevel);

	var fwd = require('./fwd').fwd;
	var fwdHttp = require('./fwd-http').fwdHttp;

	var filters = {
		'127.\\d+.\\d+.\\d+;192.168.\\d+.\\d+;nx-*;t-*;x-*;rsb00*;b000*;kok*-*;*.dev;localhost': 'http://localhost:9990',
		'172.16.\\d+.\\d+;172.17.\\d+.\\d+;rssv*;*.group': 'http://localhost:9998',
		//'\\d+.\\d+.\\d+.\\d+': null,
		'*': 'http://localhost:9998'};

	fwd({log:log, servicePort:9999, proxyUrl:'http://localhost:9991', binaryUrl:'http://localhost:9998'});
	fwd({log:log, servicePort:8888, proxyUrl:'http://localhost:9992', binaryUrl:'http://localhost:9998'});
	fwdHttp({log:log, servicePort:9991, filters:filters});
	fwdHttp({log:log, servicePort:9992, filters:filters});
	fwdHttp({log:log, servicePort:9990}); // direct
	fwdHttp({log:log, servicePort:9998}); // external
