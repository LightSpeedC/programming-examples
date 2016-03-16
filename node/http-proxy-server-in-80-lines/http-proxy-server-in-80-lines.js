void function () {
	'use strict';
	var http = require('http');
	var url  = require('url');
	var net  = require('net');
	var HTTP_PORT = process.argv[2] || 8080;  // internal proxy server port
	var PROXY_URL = process.argv[3] || null;  // external proxy server URL
	var PROXY_HOST = PROXY_URL ?  url.parse(PROXY_URL).hostname    : null;
	var PROXY_PORT = PROXY_URL ? (url.parse(PROXY_URL).port || 80) : null;

	function printError(err, msg, url) {
		console.log('%s %s: %s %s', new Date().toLocaleTimeString(), msg, err, url);
	}

	var server = http.createServer(function onCliReq(cliReq, cliRes) {
		var cliSoc = cliReq.socket || cliReq.connection;
		var x = url.parse(cliReq.url);
		if (PROXY_URL)
			var options = {host: PROXY_HOST, port: PROXY_PORT, path: cliReq.url,
					 method: cliReq.method, headers: cliReq.headers, agent: cliSoc.$agent};
		else
			var options = {host: x.hostname, port: x.port || 80, path: x.path,
					 method: cliReq.method, headers: cliReq.headers, agent: cliSoc.$agent};
		var svrReq = http.request(options, function onSvrRes(svrRes) {
			cliRes.writeHead(svrRes.statusCode, svrRes.headers);
			svrRes.pipe(cliRes);
		});
		cliReq.pipe(svrReq);
		svrReq.on('error', function onSvrReqErr(err) {
			cliRes.writeHead(400, err.message, {'content-type': 'text/html'});
			cliRes.end('<h1>' + err.message + '<br/>' + cliReq.url + '</h1>');
			printError(err, 'svrReq', x.hostname + ':' + (x.port || 80));
		});
	}).listen(HTTP_PORT);

	server.on('clientError', function onCliErr(err, cliSoc) {
		cliSoc.end();
		printError(err, 'cliErr', '');
	});

	server.on('connect', function onCliConn(cliReq, cliSoc, cliHead) {
		var x = url.parse('https://' + cliReq.url);
		if (PROXY_URL) {
			var options = {host: PROXY_HOST, port: PROXY_PORT, path: cliReq.url,
					 method: cliReq.method, headers: cliReq.headers, agent: cliSoc.$agent};
			var svrReq = http.request(options);
			svrReq.end();
			var svrSoc = null;
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
			var svrSoc = net.connect(x.port || 443, x.hostname, function onSvrConn() {
				cliSoc.write('HTTP/1.0 200 Connection established\r\n\r\n');
				if (cliHead && cliHead.length) svrSoc.write(cliHead);
				cliSoc.pipe(svrSoc);
			});
			svrSoc.pipe(cliSoc);
			svrSoc.on('error', funcOnSocErr(cliSoc, 'svrSoc', cliReq.url));
		}
		cliSoc.on('error', function onCliSocErr(err) {
			if (svrSoc) svrSoc.end();
			printError(err, 'cliSoc', cliReq.url);
		});
		function funcOnSocErr(soc, msg, url) {
			return function onSocErr(err) {
				soc.end();
				printError(err, msg, url);
			};
		}
	});

	server.on('connection', function onConn(cliSoc) {
		cliSoc.$agent = new http.Agent({keepAlive: true});
		cliSoc.$agent.on('error', function onAgentErr(err) {
			console.log('agent %s', err + '');
		});
	});

	console.log('http proxy server started on port ' + HTTP_PORT +
			(PROXY_URL ? ' -> ' + PROXY_HOST + ':' + PROXY_PORT : ''));
}();
