// net-server

void function () {
	'use strict';

	module.exports = NetServer;

	const net = require('net');

	// NetServer
	// opts: {port, host}
	function NetServer(opts) {
		var callbacks = [];
		var cb = arguments[arguments.length - 1];
		if (typeof cb === 'function') callbacks.push(cb);
		else cb = undefined;

		var server = net.createServer();
		server.listen();

		return thunk;
		function thunk(cb) {
			if (typeof cb === 'function') callbacks.push(cb);
		}
	}

}();
