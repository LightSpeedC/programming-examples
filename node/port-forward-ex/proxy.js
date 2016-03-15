(function () {
	'use strict';

	console.log(__filename);

	// dependency modules 依存モジュール
	var http = require('http');
	var url  = require('url');
	var net  = require('net');

	var LogManager = require('log-manager');
	var log = LogManager.getLogger();

	// arguments 引数
	var HTTP_PORT = process.argv[2] || 8080;  // internal proxy server port
	var PROXY_URL = process.argv[3] || null;  // external proxy server URL
	var level = (process.argv[4] || 'info');
	var RS = (process.argv[5] || null);

	if (PROXY_URL === 'null' || PROXY_URL === 'none') PROXY_URL = null;

	var PROXY_HOST = PROXY_URL ?  url.parse(PROXY_URL).hostname    : null;
	var PROXY_PORT = PROXY_URL ? (url.parse(PROXY_URL).port || 80) : null;

	// title タイトル
	if (process.title.indexOf('; ') > 0)
		process.title = process.title.slice(process.title.indexOf('; ') + 2);
	process.title = 'proxy ' + HTTP_PORT +
		(PROXY_URL ? ' -> ' + PROXY_HOST + ':' + PROXY_PORT: '') +
		'; ' + process.title;

	// node version
	log.info('node %s %s %s', process.version, process.arch, process.platform);

	var IS_TRACE = log.isTrace();

	// conncetion count 接続数
	var connCount = 0;

	function lpad2(x) {
		x = '' + x;
		return '  '.slice(x.length) + x;
	}

	// http server
	var server = http.createServer(function onCliReq(cliReq, cliRes) {
	// cliReq.httpVersion
	// cliReq.trailers
	// cliReq.rawTrailers

		// socket connection of client request クライアント要求のソケット接続
		var cliSoc = cliReq.socket || cliReq.connection;

		var x = url.parse(cliReq.url);

		log.info('http  (%s) %s', lpad2(connCount),
				x.hostname + ':' + (x.port || 80) /* + ' ' + x.path */);

		// request headers 要求ヘッダ
		var reqHeaders = {};
		if (cliReq.rawHeaders) // if Node > v0.11.*
			for (var i = 0; i < cliReq.rawHeaders.length; i += 2)
				reqHeaders[cliReq.rawHeaders[i]] = cliReq.rawHeaders[i + 1];
		else reqHeaders = cliReq.headers;

		log.debug('\x1b[41m%s\x1b[m', reqHeaders['User-Agent'] || reqHeaders['user-agent'] ||
			'? ' + (reqHeaders['Host'] || reqHeaders['host']));

		if (IS_TRACE) {
			log.trace('######################################################################');
			log.trace(cliReq.method + ' ' + cliReq.url + ' ' + cliReq.httpVersion);
			for (var i in reqHeaders)
				log.trace(i + ': ' + reqHeaders[i]);
			log.trace();
		}

	/*
		var connection = reqHeaders['Proxy-Connection'] || reqHeaders['proxy-connection'] ||
										 reqHeaders['Connection'] || reqHeaders['connection'];
		delete reqHeaders['Connection'];
		delete reqHeaders['connection'];
		delete reqHeaders['Proxy-Connection'];
		delete reqHeaders['proxy-connection'];
		delete reqHeaders['Cache-Control'];
		delete reqHeaders['cache-control'];
		if (connection) reqHeaders['Connection'] = connection;
	*/

		// proxy or direct
		if (PROXY_URL)
			var options = {host: PROXY_HOST, port: PROXY_PORT, path: cliReq.url,
										 method: cliReq.method, headers: reqHeaders, agent: cliSoc.$agent};
		else
			var options = {host: x.hostname, port: x.port || 80, path: x.path,
										 method: cliReq.method, headers: reqHeaders, agent: cliSoc.$agent};

		// send request 要求を送信
		var svrReq = http.request(options, function onSvrRes(svrRes) {

			// response headers 応答ヘッダ
			var resHeaders = {};
			if (svrRes.rawHeaders) // if Node > v0.11.*
				for (var i = 0; i < svrRes.rawHeaders.length; i += 2)
					resHeaders[svrRes.rawHeaders[i]] = svrRes.rawHeaders[i + 1];
			else resHeaders = svrRes.headers;

			if (IS_TRACE) {
				log.trace('======================================================================');
				log.trace(cliReq.method + ' ' + cliReq.url);
				log.trace(svrRes.statusCode + ' ' + http.STATUS_CODES[svrRes.statusCode]);
				for (var i in resHeaders)
					log.trace(i + ': ' + resHeaders[i]);
				log.trace();
			}

			// 応答ヘッダに Date が無ければ、そのまま
			cliRes.sendDate = false;

			// 非サポート: ステータスメッセージ
			if (svrRes.statusMessage) // not yet implemented (still v0.11.8)
				cliRes.writeHead(svrRes.statusCode, svrRes.statusMessage, resHeaders);
			else
				cliRes.writeHead(svrRes.statusCode, resHeaders);

			// サーバ応答を、クライアント応答へ流す
			//svrRes.pipe(cliRes);
			svrRes.on('readable', function () {
				var data = svrRes.read();
				if (!data) return;
				cliRes.write(data);
			}); // svrRes on eadable
			svrRes.on('end', function () {
				cliRes.end();
				var connection = resHeaders['Connection'] || resHeaders['connection'] ||
						 resHeaders['Proxy-Connection'] || resHeaders['proxy-connection'];
				if (connection && connection.toLowerCase() === 'close')
					cliSoc.end();

				if (!cliSoc.$serverRequested)
					log.warn('######(%s) server request false! twice!', lpad2(connCount));
				cliSoc.$serverRequested = false;

			}); // svrRes on end
		}); // http.request
		if (cliSoc.$serverRequested)
			log.warn('######(%s) server requested! twice!', lpad2(connCount));
		cliSoc.$serverRequested = true;

		// クライアント要求を、サーバ要求へ流す
		cliReq.pipe(svrReq);

		// サーバ要求エラー時
		svrReq.on('error', function onSvrReqErr(err) {
			cliRes.writeHead(400, {'content-type': 'text/html'});
			cliRes.end('<h1>' + err.message + '<br/>' + cliReq.url + '</h1>');
			log.warn('svrReq(%s) %s %s', lpad2(connCount), err + '', x.hostname + ':' + (x.port || 80));
		});
	}).listen(HTTP_PORT, function () {
		process.on('uncaughtException', function (err) {
			var msg1 = /\n    at exports._errnoException \(util.js:\d*:\d*\)\n    at TCP.onread \(net.js:\d*:\d*\)/;
			log.warn('uncExc(%s) %s', lpad2(connCount), err.stack.replace(msg1, ''));
		});
	});

	// クライアント要求エラー時
	server.on('clientError', function onCliErr(err, cliSoc) {
		// cliSoc.end(); // ためしにコメント
		log.warn('cliErr(%s) %s', lpad2(connCount), err + '');
	});

	// HTTP CONNECT request コネクト要求
	server.on('connect', function onCliConn(cliReq, cliSoc, cliHead) {
		// コネクト要求のURLは server:port 形式
		var x = url.parse('https://' + cliReq.url);

		log.info('https (%s) %s', lpad2(connCount), cliReq.url);

		// request headers 要求ヘッダ
		var reqHeaders = {};
		if (cliReq.rawHeaders) // if Node > v0.11.*
			for (var i = 0; i < cliReq.rawHeaders.length; i += 2)
				reqHeaders[cliReq.rawHeaders[i]] = cliReq.rawHeaders[i + 1];
		else reqHeaders = cliReq.headers;

		log.debug('\x1b[41m%s\x1b[m', reqHeaders['User-Agent'] || reqHeaders['user-agent'] ||
			'? ' + (reqHeaders['Host'] || reqHeaders['host']));

		if (IS_TRACE) {
			log.trace('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$');
			log.trace(cliReq.method + ' ' + cliReq.url + ' ' + cliReq.httpVersion);
			for (var i in reqHeaders)
				log.trace(i + ': ' + reqHeaders[i]);
			log.trace();
		}

		// proxy or direct
		if (PROXY_HOST) {
			var options = {host: PROXY_HOST, port: PROXY_PORT, path: cliReq.url,
										 method: cliReq.method, headers: reqHeaders, agent: cliSoc.$agent};
			var svrReq = http.request(options);
			if (cliSoc.$serverRequested)
				log.warn('$$$$$$(%s) server requested! twice!', lpad2(connCount));
			cliSoc.$serverRequested = true;
			svrReq.end();
			var svrSoc = null;
			svrReq.on('connect', function onSvrConn(svrRes, svrSoc2, svrHead) {
				svrSoc = svrSoc2;
				if (IS_TRACE) {
					log.trace('%s', '%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%');
					log.trace('HTTP/1.1 200 Connection established\n');
				}
				cliSoc.write('HTTP/1.1 200 Connection established\r\n\r\n');
				if (cliHead && cliHead.length) svrSoc.write(cliHead);
				if (svrHead && svrHead.length) cliSoc.write(svrHead);
				svrSoc.pipe(cliSoc);
				cliSoc.pipe(svrSoc);
				svrSoc.on('end', function () {
					if (!cliSoc.$serverRequested)
						log.warn('$$$$$$(%s) server request false! twice!', lpad2(connCount));
					cliSoc.$serverRequested = false;
				});
				svrSoc.on('error', funcOnSocErr(cliSoc, 'svrSoc', cliReq.url));
			});
			svrReq.on('error', funcOnSocErr(cliSoc, 'svrRq2', cliReq.url));
		} // if PROXY_HOST
		else {
			var svrSoc = net.connect(x.port || 443, x.hostname, function onSvrConn() {
				if (IS_TRACE) {
					log.trace('%s', '%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%');
					log.trace('HTTP/1.1 200 Connection established\n');
				}
				cliSoc.write('HTTP/1.1 200 Connection established\r\n\r\n');
				if (cliHead && cliHead.length) svrSoc.write(cliHead);
				cliSoc.pipe(svrSoc);
			});
			svrSoc.pipe(cliSoc);
			svrSoc.on('error', funcOnSocErr(cliSoc, 'svrSoc', cliReq.url));
		}
		cliSoc.removeAllListeners('error');
		cliSoc.on('error', function onCliSocErr(err) {
			// if (svrSoc) svrSoc.end(); // 試しにコメント
			log.warn('cliSoc(%s) %s %s', lpad2(connCount), err + '', cliReq.url);
		});
		function funcOnSocErr(soc, msg, url) {
			return function onSocErr(err) {
				// soc.end(); // 試しにコメント
				log.warn('%s(%s) %s %s', msg, lpad2(connCount), err + '', url);
			};
		}
	});

	// 開始ログ
	log.info('http proxy server started on port ' + HTTP_PORT +
			(PROXY_URL ? ' -> ' + PROXY_HOST + ':' + PROXY_PORT : ''));

	LogManager.setLevel(level);
	IS_TRACE = log.isTrace();

	// white address list
	var whiteAddressList = {
		'127.0.0.1'      : true};

	// 接続時
	// アドレスチェック
	// 接続数カウントUP/DOWN
	server.on('connection', function onConn(cliSoc) {
		var remoteAddress = cliSoc.remoteAddress;
		if (remoteAddress.slice(0, 7) === '::ffff:')
			remoteAddress = remoteAddress.slice(7);

		// ホワイトアドレスリストからの接続のみ許可する
		if (!(whiteAddressList[remoteAddress])) {
			log.warn('reject(%s) from: %s', lpad2(connCount),
					cliSoc.remoteAddress);
			return cliSoc.destroy();
		}

		// 接続時刻と接続カウント
		var connTime = new Date();
		++connCount;

		log.debug('++conn(%s) from: %s', lpad2(connCount),
				cliSoc.remoteAddress);

		// http Agent エージェント
		// ソケット接続1つに対して、HTTP接続要求は1つまでとする
		cliSoc.$agent = new http.Agent({keepAlive: true});
		// cliSoc.$agent.maxSockets = 1;
		cliSoc.$serverRequested = false;

		cliSoc.$agent.on('error', function onAgentErr(err) {
			log.warn('agent (%s) %s', lpad2(connCount), err + '');
		});

		// 接続を閉じる時
		cliSoc.on('close', function onDisconn() {
			--connCount;
			log.debug('--conn(%s) time: %s sec', lpad2(connCount),
					(new Date() - connTime) / 1000.0);
		});
	});

})();
