void function () {
	'use strict';

	var os = require('os');
	var nets = os.networkInterfaces();
	var locals = {};
	Object.keys(nets).forEach(n => nets[n].forEach(x => locals[x.address] = 'localhost'));
	//Object.keys(nets).forEach(n => nets[n].forEach(x => console.log(x.address)));

	var settings = require('./settings.json');
	var dumpBuffer = require('./dump-buffer');

	var port = 3000;
	var net = require('net');
	var server = net.createServer(soc => {
		var from = locals[soc.remoteAddress] || soc.remoteAddress;
		if (from.slice(0, 7) === '::ffff:') from = from.slice(7);
		console.log(from);
		//console.log(soc);

		soc.on('readable', () => {
			//console.log('readable');
			var buf = soc.read();
			if (!buf) return;
			//console.log('read', buf);
			soc.write(buf);
			dumpBuffer(buf, 'xxx ');
		});
		soc.on('end', () => {
			console.log('end');
			soc.end();
		});
		soc.on('error', err => { console.log('err', err); });
		//soc.write()
	}).listen(port, () => console.log(port + ' started'));

}();
