// port-server.js

void function () {
	const port = process.argv[2] || 8080;
	const proxyHost = process.argv[3] || 'localhost';
	const proxyPort = process.argv[4] || 80;
	const net = require('net');
	const TransformXor = require('./transform-xor');
	var log = new (require('log-manager'))().setWriter(new require('log-writer')('port-server-%s.log')).getLogger();
	const server = net.createServer(cliSoc => {
		const x1 = new TransformXor(0xCD);
		const x2 = new TransformXor(0xCD);
		const svrSoc = net.connect({host:proxyHost, port:proxyPort}, () => {
			cliSoc.pipe(x1);
			x1.pipe(svrSoc);
			svrSoc.pipe(x2);
			x2.pipe(cliSoc);
		});
	});
	server.listen(port, () => {
		//var port = server.address().port;
		console.log('listen', port);
	});
}();
