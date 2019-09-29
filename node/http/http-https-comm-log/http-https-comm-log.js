'use strict';

const https = require('https');
const http = require('http');
const url = require('url');
const fs = require('fs');

const config = require('./config');
console.log(config);
const port = config.local.port;

//http.createServer((req, res) => {
//	res.writeHead(200, {'Content-Type': 'text/plain'});
//	res.end('Hello World\n');
//}).listen(config.local.port);

const pfx = fs.readFileSync(config.remote.pfx);
const passphrase = config.remote.passphrase;
// fx, key, passphrase, cert, ca, ciphers,
// rejectUnauthorized, secureProtocol, servername

http.createServer((cliReq, cliRes) => {
	// const x = url.parse(cliReq.url);
	const opt = {
		host: config.remote.host,
		port: config.remote.port || 443,
		path: cliReq.url, // x.path,
		method: cliReq.method,
		headers: cliReq.headers,
		pfx: pfx,
		passphrase: passphrase,
	};

	const buffs = [];

	cliReq.on('error', err => console.error(new Date(), err));
	cliReq.on('data', data => {
		buffs.push(data);
	});
	cliReq.on('end', data => {
		// クライアントからのリクエストの終了
		if (data) buffs.push(data);

		const buff = Buffer.concat(buffs);

		try {
			const svrReq = http.request(opt, svrRes => {
				cliRes.writeHead(svrRes.statusCode, svrRes.headers);
				svrRes.pipe(cliRes);
			});
			svrReq.on('error', onError);
			svrReq.write(buff);
			svrReq.end();
		} catch (err) {
			onError(err);
			//console.error(new Date(), err);
		}
		function onError(err) {
			console.error(new Date(), err);
			cliRes.writeHead(500, 'Internal Error');
			cliRes.write('error: ' + err.stack);
			cliRes.end();
		}
	});

	//const svrReq = http.request(opt, svrRes => {
	//	cliRes.writeHead(svrRes.statusCode, svrRes.headers);
	//	svrRes.pipe(cliRes); });
	//cliReq.pipe(svrReq);

}).listen(port, () => {
	console.log('Server running at http://localhost:' + port);
});
