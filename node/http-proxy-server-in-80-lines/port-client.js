// port-client.js

void function () {
	const port = process.argv[2] || 9998;
	const proxyHost = process.argv[3] || 'localhost';
	const proxyPort = process.argv[4] || 9997;
	const net = require('net');
	const TransformXor = require('./transform-xor');
	var log = new (require('log-manager'))().setWriter(new require('log-writer')('connector-%s.log')).getLogger();
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
