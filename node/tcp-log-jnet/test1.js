void function () {
	'use strict';

	var os = require('os');
	var nets = os.networkInterfaces();
	var locals = {};
	Object.keys(nets).forEach(n => nets[n].forEach(x => locals[x.address] = 'localhost'));
	//Object.keys(nets).forEach(n => nets[n].forEach(x => console.log(x.address)));

	var settings = require('./settings.json');

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
			dump(buf, 'xxx ');
		});
		soc.on('end', () => {
			console.log('end');
			soc.end();
		});
		soc.on('error', err => { console.log('err', err); });
		//soc.write()
	}).listen(port, () => console.log(port + ' started'));

	var N = 16;
	function dump(buf, dir) {
		if (!buf) return;

		if (buf.length === 0) return wr('Buffer <>\r\n');

		for (var j = 0, n = buf.length; j < n; j += N) {
			wr(dir + ('000' + j.toString(16)).slice(-4) + ': ');
			for (var i = 0; i < N; ++i) {
				var c = i + j < n ? buf[i + j] : '.'.charCodeAt(0);
				var s = ('0' + c.toString(16)).slice(-2);
				if (i + j < n)
					if (c >= 0x20 && c <= 0x7e) wr(' ' + s);
					else if (c === 0x0d) wr(' \x1b[41m' + s + '\x1b[m');
					else if (c === 0x0a) wr(' \x1b[42m' + s + '\x1b[m');
					else wr(' \x1b[43m' + s + '\x1b[m');
				else wr(' \x1b[44;30m**\x1b[m');
			}
			wr('  ');
			for (var i = 0; i < N; ++i) {
				var c = i + j < n ? buf[i + j] : '.'.charCodeAt(0);
				if (i + j < n)
					if (c >= 0x20 && c <= 0x7e) wr(String.fromCharCode(c));
					else if (c === 0x0d) wr('\x1b[41mr\x1b[m');
					else if (c === 0x0a) wr('\x1b[42mn\x1b[m');
					else wr('\x1b[43m*\x1b[m');
				else wr('\x1b[44;30m*\x1b[m');
			}
			wr('  **\r\n');
		}

	}

	function wr(x) {
		process.stdout.write(x);
	}

}();
