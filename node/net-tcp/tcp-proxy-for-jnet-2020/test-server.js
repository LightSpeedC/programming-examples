'use strict';

const net = require('net');

startServer(51000);
startServer(52000);
startServer(59000);

function startServer(port) {
	net.createServer({allowHalfOpen: false}, c => {
		let n = 2;
		c.on('error', err => console.log('c:', port, 'err: ' + err));
		c.on('data', data => {
			c.write('!' + String(port) + ':');
			c.write(data);
			if (--n < 0) c.end(), console.log('c:', port, 'end!');
		});
		c.on('end', () => console.log('c:', port, 'end:'));
	}).listen(port, () => console.log('listen', port));
}
