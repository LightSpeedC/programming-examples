void function () {
	'use strict';
	const LogManager = require('log-manager'), LogWriter = require('log-writer');
	const log = new LogManager().setWriter(new LogWriter('proxy-%s.log')).getLogger();
	const http = require('http'), url = require('url'), net  = require('net');
	const fs = require('fs'), util = require('util');
	const HTTP_PORT = process.argv[2] || 8080;  // internal proxy server port
	const PROXY_URL = process.argv[3] || null;  // external proxy server URL
	const PROXY_HOST = PROXY_URL ?  url.parse(PROXY_URL).hostname    : null;
	const PROXY_PORT = PROXY_URL ? (url.parse(PROXY_URL).port || 80) : null;
	const getPathObjects = require('./get-path-objects');
	try { var root1 = require('./root1'); } catch (err) { root1 = {}; }
	try { var root2 = require('./root2'); } catch (err) { root2 = {}; }
	log.info('node', process.version, process.arch, process.platform);
	log.info('node exec path:', process.execPath);

	var count1 = 0, count2 = 0;
	var denyCount = 0, grantCount = 0;

	// interval
	setInterval(function () {
		if (count1 > 0) {
			--count1;
			if (count1 === 0) saveObject('./root1.js', root1);
		}
		if (count2 > 0) {
			--count2;
			if (count2 === 0) saveObject('./root2.js', root2);
		}
		if (denyCount || grantCount) log.info('grant', grantCount, 'deny', denyCount);
		if (denyCount > 0) --denyCount;
		if (grantCount > 0) --grantCount;
	}, 1000);

	// sortObject
	function sortObject(obj) {
		if (typeof obj === 'object' && obj) {
			return Object.keys(obj).sort().reduce((a, b) => {
				a[b] = sortObject(obj[b]); return a;
			}, {});
		}
		else return obj;
	}

	// saveObject
	function saveObject(file, obj) {
		fs.writeFile(file, 'module.exports =\n' +
			util.inspect(sortObject(obj), {depth:null}) + '\n');
	}

	// printError
	function printError(err, msg, url, soc) {
		if (soc) soc.destroy();
		if (soc && soc.$startTime) log.warn((Date.now() - soc.$startTime) / 1000,
				'sec from', soc.$startTime);
		log.warn('%s: %s', msg, url, err);
	}

	// accessCheck
	function accessCheck(chk, o) {
		return chk && !(o[' '] && o[' '].exclude);
	}

	// accessLog
	function accessLog(o) {
		var s = o[' '] = o[' '] || {count:0, firstTime:Date.now()};
		s.count++;
		s.lastTime = Date.now();
	}

	const server = http.createServer(function onCliReq(cliReq, cliRes) {
		var svrSoc;
		const cliSoc = cliReq.socket, x = url.parse(cliReq.url);
		if (cliReq.url.indexOf('$grant-all$') > -1) grantCount = 10;
		if (cliReq.url.indexOf('$deny-all$') > -1)  denyCount = 10;
		count1 = 3;
		if (!grantCount && !getPathObjects(root1, x.href).reduce(accessCheck, true))
			return cliRes.end('// access denied');
		count2 = 3;
		getPathObjects(root2, x.href).forEach(accessLog);
		if (denyCount) return cliRes.end('// access denied');
		const svrReq = http.request({host: PROXY_HOST || x.hostname,
				port: PROXY_PORT || x.port || 80,
				path: PROXY_URL ? cliReq.url : x.path,
				method: cliReq.method, headers: cliReq.headers,
				agent: cliSoc.$agent}, function onSvrRes(svrRes) {
			svrSoc = svrRes.socket;
			if (svrSoc && !svrSoc.$startTime) svrSoc.$startTime = new Date();
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

	//server.on('clientError', (err, soc) => printError(err, 'cliErr', '', soc));

	server.on('connect', function onCliConn(cliReq, cliSoc, cliHead) {
		const x = url.parse('https://' + cliReq.url);
		count1 = 3;
		if (!grantCount && !getPathObjects(root1, x.href).reduce(accessCheck, true))
			return cliSoc.end();
		count2 = 3; getPathObjects(root2, x.href).forEach(accessLog);
		if (denyCount) return cliSoc.end();
		var svrSoc;
		if (PROXY_URL) {
			const svrReq = http.request({host: PROXY_HOST, port: PROXY_PORT,
					path: cliReq.url, method: cliReq.method, headers: cliReq.headers,
					agent: cliSoc.$agent});
			svrReq.end();
			svrReq.on('connect', function onSvrConn(svrRes, svrSoc2, svrHead) {
				svrSoc = svrSoc2;
				if (!svrSoc.$startTime) svrSoc.$startTime = new Date();
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
			if (!svrSoc.$startTime) svrSoc.$startTime = new Date();
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
		if (cliSoc.$startTime) log.warn('eh!? cliSoc reused!?'); //@@@@@@@@@@@
		cliSoc.$startTime = new Date();
	});

	log.info('http proxy server started on port ' + HTTP_PORT +
			(PROXY_URL ? ' -> ' + PROXY_HOST + ':' + PROXY_PORT : ''));
}();
