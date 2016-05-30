void function () {
	'use strict';

	const net = require('net');

	module.exports = startService;

	if (module === require.main) {
		console.log('main');
		startService((err, res) => console.log(1, err, res));
		startService({port: 80}, (err, res) => console.log(2, err, res));
	}

	function startService() {
		const cbs = [];
		if (typeof arguments[arguments.length - 1] === 'function')
			cbs.push(arguments[--arguments.length]);

		let opts = {};
		if (arguments.length > 0 && typeof arguments[0] === 'object' && arguments[0])
			opts = arguments[0];
		if (typeof opts.port !== 'number')
			opts.port = 0;

		let results;
		function finish(err, result) {
			results = arguments;
			cbs.forEach(fn => fn.apply(null, results));
		}
		function thunk(cb) {
			if (typeof cb === 'function') cbs.push(cb);
			if (results) cb.apply(null, results);
		}

		const result = {};
		result.server = net.createServer(soc => {
			console.log('connected');
			soc.end();
		});
		result.server.listen(opts.port, () => {
			result.address = result.server.address();
			result.port = result.address.port;
			finish(null, result);
		});
		result.server.on('error', finish);
		return thunk;
	}

}();
