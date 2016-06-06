	const logFile = 'log/kms-%s.log';
	const logLevel = 'debug';
	const log = require('log-manager').setWriter(new require('log-writer')(logFile)).getLogger();
	log.setLevel(logLevel);

	const fwd = require('./fwd').fwd;
	const {KMSHOST, KMSPORT} = process.env;

	fwd({log:log, servicePort:KMSPORT,
		proxyUrl:'http://' + KMSHOST + ':' + KMSPORT,
		binaryUrl:'http://' + KMSHOST + ':' + KMSPORT});
