	'use strict';
	const net = require('net');
	[{port:1521, fport:1521, fhost:'192.168.100.131'},
	 {port:1522, fport:1521, fhost:'192.168.100.131'}]
	.forEach(x =>
		net.createServer({allowHalfOpen: false}, c => {
			const s = net.connect(x.fport, x.fhost);
			c.pipe(s); s.pipe(c);
			c.on('error', e => (console.log('c:' + e), c.end(), s.end()));
			s.on('error', e => (console.log('s:' + e), c.end(), s.end()));
		}).listen(x.port, () => console.log('listening:', x.port))
	); // forEach
