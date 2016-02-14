// net-serve-any-port.js

void function () {
	'use strict';

	var net = require('net');

	var server = net.createServer({allowHalfOpen:true},
			function connection(c) {
	});
	server.on('error', function error(err) {
		console.error('server error:', err);
	});
	server.listen(function listening() {
		console.info('net server listening port:', server.address().port);
	});

}();
