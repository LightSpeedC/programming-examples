'use strict';

const http = require('http'), url = require('url'), net = require('net');

// process.env.AUTH_PROXY &&
/// console.log(url.parse(process.env.AUTH_PROXY));
// Url {
//  protocol: 'http:',
//  slashes: true,
//  auth: 'user:pass', ********************
//  host: 'proxyhost:proxyport',
//  port: 'proxyport', ********************
//  hostname: 'proxyhost', ****************
//  hash: null,
//  search: null,
//  query: null,
//  pathname: '/',
//  path: '/',
//  href: 'http://user:pass@proxyhost:proxyport/' }

// internal proxy server port
const HTTP_PORT = Number(process.argv[2] ||
	(process.env.HTTP_PROXY ? url.parse(process.env.HTTP_PROXY).port : 8080));
// external proxy server URL
const PROXY_URL = process.argv[3] || process.env.AUTH_PROXY || null;
const PROXY_HOST = PROXY_URL ?  url.parse(PROXY_URL).hostname    : null;
const PROXY_PORT = PROXY_URL ? (url.parse(PROXY_URL).port || 80) : null;
const PROXY_AUTH = PROXY_URL ?
	Buffer.from(url.parse(PROXY_URL).auth).toString('base64')    : null;

const getNow = () => new Date().toLocaleTimeString();
console.log(new Date().toLocaleDateString(), getNow());

const COLORS = {
	RED: '\x1b[31m',
	GREEN: '\x1b[32m',
	YELLOW: '\x1b[33m',
	BLUE: '\x1b[34m',
	MAGENTA: '\x1b[35m',
	CYAN: '\x1b[36m',
	WHITE: '\x1b[37m',
	RESET: '\x1b[m',
};
const CRLF = '\r\n';

const util = require('util'), inspect = x => util.inspect(x, {colors: true});

function headersToString(headers, options) {
	if (!options) options = {};
	const keys = Object.keys(headers).filter(x => (options.exclude || []).indexOf(x) < 0);
	return keys.map(x => '  ' + x + ': ' + headers[x]).join(CRLF);
}

const server = http.createServer(function onCliReq(cliReq, cliRes) {
	let svrSoc;
	const cliSoc = cliReq.socket, x = url.parse(cliReq.url);

	if (PROXY_AUTH)
		cliReq.headers['proxy-authorization'] = 'Basic ' + PROXY_AUTH;

	// @@
	// console.log(getNow(), COLORS.GREEN + cliReq.method, cliReq.url + CRLF +
	//		COLORS.CYAN + headersToString(cliReq.headers,
	//		{exclude: ['cookie']}) + COLORS.RESET);

	const svrReq = http.request({host: PROXY_HOST || x.hostname,
			port: PROXY_PORT || x.port || 80,
			path: PROXY_URL ? cliReq.url : x.path,
			method: cliReq.method, headers: cliReq.headers,
			agent: cliSoc.$agent}, function onSvrRes(svrRes) {

		// @@
		// console.log(getNow(), COLORS.YELLOW + cliReq.method, cliReq.url,
		//	COLORS.RESET + CRLF, svrRes.statusCode, svrRes.statusMessage +
		//	CRLF + COLORS.CYAN +
		//		headersToString(svrRes.headers,
		//		{exclude: ['set-cookie']}) + COLORS.RESET);

		svrSoc = svrRes.socket;
		cliRes.writeHead(svrRes.statusCode, svrRes.headers);
		svrRes.pipe(cliRes);
	});
	cliReq.pipe(svrReq);
	svrReq.on('error', function onSvrReqErr(err) {
		cliRes.writeHead(400, err.message, {'content-type': 'text/html'});
		cliRes.end('<h1>' + err.message + '<br/>' + cliReq.url + '</h1>');
		onErr(err, 'svrReq', x.hostname + ':' + (x.port || 80), svrSoc);
	});
})
.on('clientError', (err, soc) => onErr(err, 'cliErr', '', soc))
.on('connect', function onCliConn(cliReq, cliSoc, cliHead) {
	const x = url.parse('https://' + cliReq.url);
	let svrSoc;
	if (PROXY_URL) {
		if (PROXY_AUTH)
			cliReq.headers['proxy-authorization'] = 'Basic ' + PROXY_AUTH;
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
			svrSoc.on('error', err => onErr(err, 'svrSoc', cliReq.url, cliSoc));
		});
		svrReq.on('error', err => onErr(err, 'svrRq2', cliReq.url, cliSoc));
	}
	else {
		svrSoc = net.connect(x.port || 443, x.hostname, function onSvrConn() {
			cliSoc.write('HTTP/1.0 200 Connection established\r\n\r\n');
			if (cliHead && cliHead.length) svrSoc.write(cliHead);
			cliSoc.pipe(svrSoc);
		});
		svrSoc.pipe(cliSoc);
		svrSoc.on('error', err => onErr(err, 'svrSoc', cliReq.url, cliSoc));
	}
	cliSoc.on('error', err => onErr(err, 'cliSoc', cliReq.url, svrSoc));
})
.on('connection', function onConn(cliSoc) {
	cliSoc.$agent = new http.Agent({keepAlive: true});
	cliSoc.$agent.on('error', err => console.log('agent:', err));
})
.listen(HTTP_PORT, () =>
	console.log('http proxy server started on port ' + HTTP_PORT +
		(PROXY_URL ? ' -> ' + PROXY_HOST + ':' + PROXY_PORT : '')));

function onErr(err, msg, url, soc) {
	if (soc) soc.end();
	console.log(getNow(), msg + ':', COLORS.RED + err + COLORS.RESET, url);
}
