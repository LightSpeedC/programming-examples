'use strict';

var os = require('os');

var ifs = os.networkInterfaces();

// exclude loopback adaptor
var nws = Object.keys(ifs).filter(n => !ifs[n][0].internal);

// ip v4 only, on first adaptor
var ips = ifs[nws[0]].filter(i => i.family === 'IPv4').map(i => i.address);

var ip = ips[1] || ips[0];
console.log(ips[0], '->', ip);

var net = require('net');

var c = net.createConnection(
		{port: process.env.APP_REMOTE_PORT || 8888,
		 host: process.env.APP_REMOTE_HOST || 'localhost',
		 localAddress: ip},
		function () {
	setTimeout(function () {
		c.destroy();
		c.end();
	}, 10 * 1000);
}).on('error', function (err) {
	console.error('c err:', err);
});
