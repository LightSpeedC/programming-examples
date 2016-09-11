// octet-scan

(function () {
	'use strict';

	const url = require('url');
	const http = require('http');

	console.log((new Date).toLocaleString() + ' starting...');

	const netIf = require('os').networkInterfaces();

	void function (obj) {
		for (var prop in obj)
			Object.prototype[prop] ||
			Object.defineProperty(Object.prototype, prop, {
				configureable: true,
				value: obj[prop]});
	} ({
		forEach: function forEach(fn) {
			for (var prop in this)
				if (this.hasOwnProperty(prop))
					fn(this[prop], prop, this);
		},
		map: function map(fn) {
			var obj = {};
			for (var prop in this)
				if (this.hasOwnProperty(prop))
					obj[prop] = fn(this[prop], prop, this);
			return obj;
		},
		filter: function filter(fn) {
			var obj = {};
			for (var prop in this)
				if (this.hasOwnProperty(prop))
					if (fn(this[prop], prop, this))
						obj[prop] = this[prop];
			return obj;
		},
		reduce: function reduce(fn, init) {
			var first = true;
			for (var prop in this)
				if (this.hasOwnProperty(prop))
					first && arguments.length <= 1 ?
					init = this[prop]:
					init = fn(init, this[prop], prop, this),
					first = false;
			return init;
		},
		reduceRight: function reduceRight(fn, init) {
			var first = true, self = this, len = arguments.length;
			Object.keys(this).reverse().forEach(function (prop) {
				if (self.hasOwnProperty(prop))
					first && len <= 1 ?
					init = self[prop]:
					init = fn(init, self[prop], prop, self),
					first = false;
			});
			return init;
		}
	});

	console.log({x:1,y:2,z:3}.reduce((x,y) => x + y));
	console.log({x:1,y:2,z:3}.reduce((x,y) => x + y, 1));
	console.log({x:1,y:2,z:3}.reduceRight((x,y) => x + y));
	console.log({x:1,y:2,z:3}.reduceRight((x,y) => x + y, 1));

	//const ips = Object.keys(netIf).map(x => netIf[x]
	const ips = netIf.map(x => x
			.filter(y => y.family === 'IPv4')
			.map(y => y.address)
			[0])
		.filter(x => x && x !== '127.0.0.1' && !x.startsWith('169.254.'))
		.map(x => x.split('.').slice(0, 3).concat('xxx').join('.'));
	console.log(ips);
	//return process.exit();

	process.on('uncaughtException', err =>
		console.log((new Date).toLocaleString() + ' uncaughtException: ' + err));

	ips.forEach(ip => {

		for (let octet = 1; octet < 255; ++octet) {

			((octet) => {
				const opts = url.parse('http://' + ip.replace('xxx', octet) + ':880');
				opts.method = 'GET';

				const time1 = new Date();
				const req = http.request(opts, (res) => {
					console.log(((new Date() - time1)/1000).toFixed(3) + ' sec, ' + opts.host + ' connected');
					require('child_process').exec('start http://' + opts.host);
				});
				req.end();
				req.on('error', function (err) {
					//console.log((new Date).toLocaleString() + ' octet:' + octet + ' error: ' + err);
				});
			}) (octet);

		} // for octet

	}); // ips.forEach

	setTimeout(process.exit, 1000);

})();
