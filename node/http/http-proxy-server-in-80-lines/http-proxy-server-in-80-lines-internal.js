void function () {
	'use strict';
	const http = require('http'), url = require('url'), net = require('net');
	const HTTP_PORT = process.argv[2] || 9999;  // internal proxy server port
	const PROXY_URL = process.argv[3] || null;  // external proxy server URL
	const PROXY_HOST = PROXY_URL ?  url.parse(PROXY_URL).hostname    : null;
	const PROXY_PORT = PROXY_URL ? (url.parse(PROXY_URL).port || 80) : null;
	const rejectURLs = (() => { try {
			return require('./reject-urls'); } catch (e) { return {}; } })();
	const fs = require('fs');

	function printError(err, msg, url, soc) {
		if (soc) soc.end();
		if (err.code === 'ETIMEDOUT') {
			const key = url.split(':')[0];
			if (!rejectURLs[key]) {
				rejectURLs[key] = new Date().toLocaleString() + ' ' + process.env.USERNAME;
				const x = Math.random();
				const prefix = __dirname + '/reject-urls.json';
				fs.writeFile(prefix + '.2' + x,
						(JSON.stringify(rejectURLs, null, '\t') + '\n').split('\n').join('\r\n'),
						err => {
					if (err) return console.log('write: ' + err);
					try { fs.renameSync(prefix, prefix + '.1' + x); } catch (e) {}
					try { fs.renameSync(prefix + '.2' + x, prefix); } catch (e) {}
					try { fs.unlinkSync(prefix + '.1' + x); } catch (e) {}
					try { fs.unlinkSync(prefix + '.2' + x); } catch (e) {}
				});
			} // if !rejectURLs[key]
		}
		console.log('%s %s: %s', new Date().toLocaleTimeString(), msg, url, err + '');
	}

	const server = http.createServer(function onCliReq(cliReq, cliRes) {
		var svrSoc;
		const cliSoc = cliReq.socket, x = url.parse(cliReq.url);
		if (rejectURLs[x.hostname]) return cliSoc.destroy(), // @@@@@@@@@@@@@@
			console.log('disconnect http://' + x.hostname);
		const svrReq = http.request({host: PROXY_HOST || x.hostname,
				port: PROXY_PORT || x.port || 80,
				path: PROXY_URL ? cliReq.url : x.path,
				method: cliReq.method, headers: cliReq.headers,
				agent: cliSoc.$agent}, function onSvrRes(svrRes) {
			svrSoc = svrRes.socket;
			cliRes.writeHead(svrRes.statusCode, svrRes.headers);
			svrRes.pipe(cliRes);
		});
		cliReq.pipe(svrReq);
		svrReq.on('error', function onSvrReqErr(err) {
			cliRes.writeHead(400, err.message, {'content-type': 'text/html'});
			cliRes.end('<h1>' + err.message + '<br/>' + cliReq.url + '</h1>');
			printError(err, 'svrReq', x.hostname + ':' + (x.port || 80), svrSoc);
		});
	}).listen(HTTP_PORT);

	server.on('clientError', (err, soc) => printError(err, 'cliErr', '', soc));

	server.on('connect', function onCliConn(cliReq, cliSoc, cliHead) {
		const x = url.parse('https://' + cliReq.url);
		if (rejectURLs[x.hostname]) return cliSoc.destroy(), // @@@@@@@@@@@@@@
			console.log('disconnect https://' + x.hostname);
		var svrSoc;
		if (PROXY_URL) {
			const svrReq = http.request({host: PROXY_HOST, port: PROXY_PORT,
					path: cliReq.url, method: cliReq.method, headers: cliReq.headers,
					agent: cliSoc.$agent});
			svrReq.end();
			svrReq.on('connect', function onSvrConn(svrRes, svrSoc2, svrHead) {
				svrSoc = svrSoc2;
				cliSoc.write('HTTP/1.0 200 Connection established\r\n\r\n');
				if (cliHead && cliHead.length) svrSoc.write(cliHead);
				if (svrHead && svrHead.length) cliSoc.write(svrHead);
				svrSoc.pipe(cliSoc);
				cliSoc.pipe(svrSoc);
				svrSoc.on('error', funcOnSocErr(cliSoc, 'svrSoc', cliReq.url));
			});
			svrReq.on('error', funcOnSocErr(cliSoc, 'svrRq2', cliReq.url));
		}
		else {
			svrSoc = net.connect(x.port || 443, x.hostname, function onSvrConn() {
				cliSoc.write('HTTP/1.0 200 Connection established\r\n\r\n');
				if (cliHead && cliHead.length) svrSoc.write(cliHead);
				cliSoc.pipe(svrSoc);
			});
			svrSoc.pipe(cliSoc);
			svrSoc.on('error', funcOnSocErr(cliSoc, 'svrSoc', cliReq.url));
		}
		cliSoc.on('error', err => printError(err, 'cliSoc', cliReq.url, svrSoc));
		function funcOnSocErr(soc, msg, url) {
			return err => printError(err, msg, url, soc);
		}
	});

	server.on('connection', function onConn(cliSoc) {
		cliSoc.$agent = new http.Agent({keepAlive: true});
		cliSoc.$agent.on('error', err => console.log('agent:', err));
	});

	console.log('http proxy server started on port ' + HTTP_PORT +
			(PROXY_URL ? ' -> ' + PROXY_HOST + ':' + PROXY_PORT : ''));
}();
