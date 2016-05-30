void function () {
	'use strict';

	const net = require('net');

	module.exports = startService;

	if (module === require.main) {
		console.log('main');
		startService((err, res) => console.log(res));
	}

	function startService(opts) {
		const cbs = [];
		let results;

		if (typeof arguments[arguments.length - 1] === 'function')
			cbs.push(arguments[--arguments.length]);

		function thunk(cb) {
			if (typeof cb === 'function') cbs.push(cb);
			if (results) cb.apply(null, results);
		}

		const result = {};
		result.server = net.createServer(soc => {
			console.log('connected');
			soc.end();
		});
		result.server.listen(() => {
			result.address = result.server.address();
			result.port = result.address.port;
			console.log(result);
			results = [null, result];
			cbs.forEach(fn => fn.apply(null, results));
		});
		result.server.on('error', err => {
			results = [err];
			cbs.forEach(fn => fn.apply(null, results));
		})
		return thunk;
	}

}();
