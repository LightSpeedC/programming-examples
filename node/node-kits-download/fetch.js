void function () {
	'use strict';

	var https = require('https');
	var http = require('http');
	var url = require('url');
	var fs = require('fs');

	var protocols = {'http:':http, 'https:':https};

	// fetch
	//   opts: Object
	//   uri: String
	//   [data]: String | Buffer | Object(JSON)
	//   [cb]: Function
	function fetch(opts, uri, data) {
		if (typeof opts !== 'object' || !opts)
			data = uri, uri = opts, opts = {};
		if (typeof uri !== 'string')
			throw new TypeError('uri must be string');
		if (typeof data === 'function')
			data = undefined;

		var cb = arguments[arguments.length -1];

		if (typeof cb === 'function')
			thunk(cb);

		return thunk;

		function thunk(cb) {
			var u = url.parse(uri);
			var rd = opts.reader || opts.readFile && fs.createReadStream(opts.readFile);
			var wr = opts.writer || opts.writeFile && fs.createWriteStream(opts.writeFile);

			var o = {host:u.host, method:opts.method || 'GET', path:u.href};
			var req = protocols[u.protocol].request(o, function (res) {
				var buffs = [], bufflen = 0;
				if (wr) res.pipe(wr);
				else {
					res.on('readable', () => {
						var buff = res.read();
						if (!buff) return;
						bufflen += buff.length;
						buffs.push(buff);
					});
				}
				typeof cb === 'function' &&
				res.on('end', () => {
					var result = {
						statusCode:res.statusCode,
						statusMessage:res.statusMessage,
						headers:res.headers,
						//rawHeaders:res.rawHeaders
					};
					if (buffs.length) result.data = Buffer.concat(buffs, bufflen);
					cb(null, result);
				});
				res.on('error', cb);
			});
			req.on('error', cb);
			if (rd) rd.pipe(req);
			else {
				if (data) {
					if (typeof data === 'string' || typeof data === 'object' && data.constructor === Buffer)
						req.write(data);
					else
						req.write(JSON.stringify(data));
				}
				req.end();
			}
		} // thunk
	}

	module.exports = fetch;
}();
