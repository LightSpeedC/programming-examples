// fwd-http.js

var fwdHttp = this.fwdHttp = function () {
	'use strict';

	var http = require('http');
	var net = require('net');
	var url = require('url');
	var aa = require('aa');
	var util = require('util');

	var MAX_DUMP_LEN = 800;

	var socketIdSeq = 0;

	function fwdHttp(config) {
		var numConnections = 0;
		var ctxConnections = {};

		// var HTTP_PORT = config.servicePort;  // internal proxy server port
		var PROXY_URL = config.proxyUrl;     // external proxy server URL
		var PROXY_HOST = PROXY_URL ?  url.parse(PROXY_URL).hostname    : null;
		var PROXY_PORT = PROXY_URL ? (Number(url.parse(PROXY_URL).port) || 80) : null;
		var PORT_COLOR = config.servicePort % 6 + 41;

		var log = config.log;
		if (!log) {
			var log = require('log-manager').setWriter(new require('log-writer')(config.logFile)).getLogger();
			log.setLevel(config.logLevel);
		}

		var filters = [];
		for (var key in config.filters) {
			var rex = new RegExp(key.replace(/,/g, ';').split(';').map(function (host) {
				return '^' + host.replace(/\./g, '\\.').replace(/\*/g, '.*') + '$';
			}).join('|'));
			//log.info([key, rex, config.filters[key]]);
			filters.push({rex:rex,
				host:config.filters[key] ? url.parse(config.filters[key]).hostname           : null,
				port:config.filters[key] ? Number(url.parse(config.filters[key]).port) || 80 : null})
		}

		var server = http.createServer(function connection(cliReq, cliRes) {
			cliReq.on('error', function (err) { log.fatal('fwdHttp cliReq.on error:', err); });
			cliRes.on('error', function (err) { log.fatal('fwdHttp cliRes.on error:', err); });
			++numConnections;
			var socketId = ++socketIdSeq;
			var ctx = {socketId:socketId, color:socketId % 6 + 41, send:[], recv:[], status:'--'}
			ctx.updateTime = ctx.startTime = Date.now();
			ctxConnections[socketId] = ctx;

			aa(function *() { // TODO indent
				// log.info('cliReq', util.inspect(cliReq, {colors:true, depth:1}));
				// log.info('cliRes', util.inspect(cliRes, {colors:true, depth:1}));

				var cliSoc = cliReq.socket || cliReq.connection;
				if (!cliSoc.$setError) {
					cliSoc.$setError = true;
					cliSoc.on('error', function (err) { log.fatal('fwdHttp cliSoc.on error:', err); });
				}

				var x = url.parse(cliReq.url);
				log.info.apply(log, logArgs(ctx, ctx.color + ';30;5', cliReq.method,
						x.hostname + ':' + (x.port || 80)));

				// request headers 要求ヘッダ
				var reqHeaders = {};
				for (var i = 0; i < cliReq.rawHeaders.length; i += 2)
					reqHeaders[cliReq.rawHeaders[i]] = cliReq.rawHeaders[i + 1];
				log.trace.apply(log, logArgs(ctx, ctx.color + ';30;5', 'headr',
					(cliReq.headers['user-agent'] || cliReq.headers['host'] || '').substr(0, 60)));

				var host = PROXY_HOST ? PROXY_HOST : x.hostname;
				var port = PROXY_PORT ? PROXY_PORT : x.port;

				for (var i = 0, n = filters.length; i < n; ++i) {
					if (x.hostname.match(filters[i].rex)) {
						log.info.apply(log, logArgs(ctx, ctx.color, 'http', x.hostname + ' match', filters[i]));
						host = filters[i].host;
						port = filters[i].port;
						break;
					}
				}
				// TODO host & port == null -> ...
				if (host == null && port == null) {
					log.warn.apply(log, logArgs(ctx, ctx.color, new Error('host & port == null')));
					cliSoc.destroy();
				}

				var options = {host: host, port: port, path: cliReq.url,
											 method: cliReq.method, headers: reqHeaders, agent: cliSoc.$agent};
				ctx.send = [options.host + ':' + options.port,
					cliReq.headers['user-agent'] || cliReq.headers['host']];

				var genChan = aa();

				// send request 要求を送信
				var svrReq = http.request(options, genChan);

				//log.info('svrReq', Object.getOwnPropertyNames(svrReq).join(', '));
				svrReq.socket &&
				svrReq.socket.on('error', function (err) { log.fatal('fwdHttp svrReq.socket.on error:', err); });

				svrReq.connection &&
				svrReq.connection.on('error', function (err) { log.fatal('fwdHttp svrReq.connection.on error:', err); });

				ctx.status = 'sn';
				cliReq.pipe(svrReq);
				svrReq.on('error', function (err) {
					ctx.status = 'ng';
					log.warn.apply(log, logArgs(ctx, ctx.color, 'send svrReq', err));
				});
				cliReq.on('error', function (err) {
					ctx.status = 'ng';
					log.warn.apply(log, logArgs(ctx, ctx.color, 'send cliReq', err));
				});
				var svrRes = yield genChan;

				//log.info('svrRes', Object.getOwnPropertyNames(svrRes).join(', '));
				var svrSoc = svrRes.socket;
				if (!svrSoc.$setError) {
					svrSoc.$setError = true;
					svrSoc.on('error', function (err) { log.fatal('fwdHttp svrRes.socket.on error:', err); });
				}

				svrRes.on('error', function (err) { log.fatal('fwdHttp svrRes.on error:', err); });
				ctx.status = 'ok';

				// response headers 応答ヘッダ
				var resHeaders = {};
				for (var i = 0; i < svrRes.rawHeaders.length; i += 2)
					resHeaders[svrRes.rawHeaders[i]] = svrRes.rawHeaders[i + 1];

				// 応答ヘッダに Date が無ければ、そのまま // TODO???
				cliRes.sendDate = false;

				// ステータスメッセージ
				if (svrRes.statusMessage)
					cliRes.writeHead(svrRes.statusCode, svrRes.statusMessage, resHeaders);
				else
					cliRes.writeHead(svrRes.statusCode, resHeaders);

				// サーバ応答を、クライアント応答へ流す
				svrRes.pipe(cliRes);
				svrRes.on('end', function () {
					deleteCtx(ctx);
				});
				return;

			}); // aa // TODO indent

		});

		// server on error
		server.on('error', function (err) {
			log.warn('\x1b[%sm%s\x1b[m fwdHttp server on error:', PORT_COLOR, config.servicePort, err);
		});

		server.listen(config.servicePort, function listening() {
			log.info('\x1b[%sm%s\x1b[m server listening', PORT_COLOR, config.servicePort);

			require('control-c')(
				function () {
					var count = 0;
					for (var i in ctxConnections) {
						var ctx = ctxConnections[i];
						var reqStr = '';
						if (ctx.send && ctx.send[0]) reqStr = ctx.send[0];
						log.info.apply(log, logArgs(ctx, ctx.color, '====', [ctx.status, seconds(ctx.updateTime), reqStr].join(' ')));
						++count;
					}
					if (count === 0)
						log.warn('\x1b[%sm%s\x1b[m ctrl-c: print status: no connections.', PORT_COLOR, config.servicePort);
				},
				function () {
					log.warn('\x1b[%sm%s\x1b[m ctrl-c: process.exit();', PORT_COLOR, config.servicePort);
					setTimeout(function () { process.exit(); }, 0);
				});

		});

		// HTTP CONNECT request コネクト要求
		server.on('connect', function onCliConn(cliReq, cliSoc, cliHead) {
			cliReq.on('error', function (err) { log.fatal('fwdHttp cliReq.on error (connect):', err); });
			cliSoc.on('error', function (err) { log.fatal('fwdHttp cliSoc.on error (connect):', err); });
			++numConnections;
			var socketId = ++socketIdSeq;
			var ctx = {socketId:socketId, color:socketId % 6 + 41, send:[], recv:[], status:'--'}
			ctx.updateTime = ctx.startTime = Date.now();
			ctxConnections[socketId] = ctx;

			// コネクト要求のURLは server:port 形式
			var x = url.parse('https://' + cliReq.url);
			log.info.apply(log, logArgs(ctx, ctx.color, 'https', cliReq.url));

			// request headers 要求ヘッダ
			var reqHeaders = {};
			for (var i = 0; i < cliReq.rawHeaders.length; i += 2)
				reqHeaders[cliReq.rawHeaders[i]] = cliReq.rawHeaders[i + 1];

			log.trace.apply(log, logArgs(ctx, ctx.color, 'heads',
				(cliReq.headers['user-agent'] || cliReq.headers['host'] || '').substr(0, 60)));

			var host = PROXY_HOST ? PROXY_HOST : x.hostname;
			var port = PROXY_PORT ? PROXY_PORT : x.port || 443;

			for (var i = 0, n = filters.length; i < n; ++i) {
				if (x.hostname.match(filters[i].rex)) {
					log.info.apply(log, logArgs(ctx, ctx.color, 'https', x.hostname + ' match', filters[i]));
					host = filters[i].host;
					port = filters[i].port;
					break;
				}
			}
			// TODO host & port == null -> ...
				if (host == null && port == null) {
					log.warn.apply(log, logArgs(ctx, ctx.color, new Error('host & port == null')));
					cliSoc.destroy();
				}

			// proxy or direct
			if (host || port) {
				var options = {host: host, port: port, path: cliReq.url,
											 method: cliReq.method, headers: reqHeaders, agent: cliSoc.$agent};
				ctx.status = 's1';
				ctx.send = [options.host + ':' + options.port + ' -> ' + options.path];
				var svrReq = http.request(options);

				if (cliSoc.$serverRequested)
					log.warn.apply(log, logArgs(ctx, ctx.color, 'https', 'server requested! twice!'));
				cliSoc.$serverRequested = true;

				var svrSoc = null;
				svrReq.on('connect', function onSvrConn(svrRes, svrSoc2, svrHead) {
					svrSoc = svrSoc2;
					svrSoc.on('error', function (err) {
						log.warn.apply(log, logArgs(ctx, ctx.color, 'svrSc2', cliReq.url, err));
					});
					svrRes.on('error', function (err) { log.fatal('fwdHttp svrRes.on error (connect):', err); });
					cliSoc.write('HTTP/1.0 200 Connection established\r\n\r\n');
					if (cliHead && cliHead.length) svrSoc.write(cliHead);
					if (svrHead && svrHead.length) cliSoc.write(svrHead);
					svrSoc.pipe(cliSoc);
					cliSoc.pipe(svrSoc);
					svrSoc.on('end', function () {
						if (!cliSoc.$serverRequested)
							log.warn.apply(log, logArgs(ctx, ctx.color, 'https', 'server request false! twice!'));
						cliSoc.$serverRequested = false;
						deleteCtx(ctx)
					}); // soc on end
				}); // on connect
				svrReq.on('error', function (err) {
					log.warn.apply(log, logArgs(ctx, ctx.color, 'svrRq2', cliReq.url, err));
					deleteCtx(ctx);
					cliSoc.destroy(); //@@@@@@@@@@@@@@@@@@@@@@
				});
				cliReq.on('error', function (err) {
					log.warn.apply(log, logArgs(ctx, ctx.color, 'cliRq2', cliReq.url, err));
				});
				cliSoc.on('error', function (err) {
					log.warn.apply(log, logArgs(ctx, ctx.color, 'cliSc2', cliReq.url, err));
				});
				svrReq.end();
			} // if PROXY_HOST
			else {
				ctx.status = 's0';
				ctx.send = [x.hostname + ':' + (x.port || 443)];
				var svrSoc = net.connect(x.port || 443, x.hostname, function onSvrConn() {
					cliSoc.write('HTTP/1.0 200 Connection established\r\n\r\n');
//          if (cliHead && cliHead.length) svrSoc.write(cliHead);
//          cliSoc.pipe(svrSoc);
				});
				if (cliHead && cliHead.length) svrSoc.write(cliHead);
				cliSoc.pipe(svrSoc);
				svrSoc.pipe(cliSoc);
				svrSoc.on('error', function (err) {
					log.warn.apply(log, logArgs(ctx, ctx.color, 'svrSc3', cliReq.url, err));
				});
				svrSoc.on('end', function () {
					deleteCtx(ctx)
				});
				cliReq.on('error', function (err) {
					log.warn.apply(log, logArgs(ctx, ctx.color, 'cliRq3', cliReq.url, err));
				});
				cliSoc.on('error', function (err) {
					log.warn.apply(log, logArgs(ctx, ctx.color, 'cliSc3', cliReq.url, err));
				});
			} // else PROXY_HOST

			cliSoc.removeAllListeners('error');
			cliSoc.on('error', function onCliSocErr(err) {
				log.warn.apply(log, logArgs(ctx, ctx.color, 'https', cliReq.url, err));
			});

		});

		log.info('\x1b[%sm%s\x1b[m config: \x1b[44m%s\x1b[m', PORT_COLOR, config.servicePort,
			[config.servicePort, config.proxyUrl]);

		// server on 'connection'
		server.on('connection', function onConn(cliSoc) {
			// http Agent エージェント
			cliSoc.$agent = new http.Agent({keepAlive: true});
			cliSoc.$serverRequested = false;

			cliSoc.$agent.on('error', function onAgentErr(err) {
				log.warn('agent err', err);
			});
		});

		// thread: reader -> writer
		function * soc2soc(ctx, reader, writer, msg, color) {
			var chan = aa().stream(reader), buff = null, count = 0;
			try {
				while(buff = yield chan) {
					ctx.updateTime = Date.now();
					if (count++ <= 0) {
						buff2str(buff).split('\r\n').forEach(function (str, i) {
							var low = str.substr(0, 90).toLowerCase();
							if (i === 0 ||
									low.startsWith('user-agent:') ||
									low.startsWith('server:')) {
								log.trace.apply(log, logArgs(ctx, color, msg, str.substr(0, 90)));
								if (i === 0) ctx[msg] = [];
								ctx[msg].push(str);
							}
						});
					}
					else {
						var str = buff2str(buff);
						if (str.startsWith('HTTP/') ||
								str.startsWith('CONNECT ') ||
								str.startsWith('GET http') ||
								str.startsWith('POST http') ||
								str.startsWith('PUT http') ||
								str.startsWith('DELETE http') ||
								str.startsWith('HEAD http') ||
								str.startsWith('OPTIONS http')) {

							str.split('\r\n').forEach(function (str, i) {
								var low = str.substr(0, 90).toLowerCase();
								if (i === 0 ||
										low.startsWith('user-agent:') ||
										low.startsWith('server:')) {
									log.trace.apply(log, logArgs(ctx, color, msg, str.substr(0, 90)));
									if (i === 0) ctx[msg] = [];
									ctx[msg].push(str);
								}
							});

						}
					}
					writer.write(buff);
					buff = null;
				}
			} catch (err) {
				log.warn.apply(log, logArgs(ctx, color, msg, err, buff ? 'write' : 'read'));
			}
			writer.end();
		}

		// logArgs(ctx, color, msg1, err, msg2)
		function logArgs(ctx, color, msg1, err, msg2) {
			return ['\x1b[%sm%s\x1b[m \x1b[%sm%s#%s %s\x1b[m %s %s %s', 
				PORT_COLOR, config.servicePort, ctx.color, zz(numConnections), zzz(ctx.socketId),
				seconds(ctx.startTime), rpad(msg1, 6), err,
				msg2 ? msg2 : ''];
		}

		// deleteCtx(ctx)
		function deleteCtx(ctx) {
			if (ctxConnections[ctx.socketId]) {
				--numConnections;
				delete ctxConnections[ctx.socketId];
			}
		}

	}

	var SPACES = '          ';
	function rpad(s, n) {
		return (s + SPACES).substr(0, Math.max(s.length, n));
	}
	function zz(x) {
		return ('0' + x).substr(-2);
	}
	function zzz(x) {
		return ('000' + x.toString(26)).substr(-4);
	}
	function seconds(startTime) {
		var s = ((Date.now() - startTime)/1000.0).toFixed(3) + ' s';
		return ('   ' + s).substr(- Math.max(s.length, 10))
	}

	var buff2strx = 41;
	function buff2str(buff) {
		if (!buff) return '<>';
		var str = '';
		var n = Math.min(buff.length, MAX_DUMP_LEN);
		var i = buff.indexOf('\r\n\r\n');
		if (i >= 0) n = Math.min(n, i);
		for (var i = 0; i < n; ++i) {
			var c = buff[i];
			if (c >= 0x20 && c <= 0x7E || c === 0x0D || c === 0x0A)
				str += String.fromCharCode(c);
			else {
				buff2strx = 41 + 42 - buff2strx;
				str += '\x1b[' + buff2strx + 'm' + ('0' + c.toString(16).toUpperCase()).slice(-2) + '\x1b[m';
			}
		}
		return str;
	}

	return fwdHttp;

}();

	if (require.main === module) {
		require('fs').mkdir('log', function (err) {
			if (err && err.code !== 'EEXIST') console.log(err);
			//fwdHttp(require('./config-proxy').config);
			fwdHttp({servicePort: 9999, proxyUrl: 'http://localhost:9997',
				logFile: 'log/proxy-%s.log', logLevel: 'trace'});
			fwdHttp({servicePort: 9997,
				logFile: 'log/proxy-%s.log', logLevel: 'trace'});
			fwdHttp({servicePort: 8888, proxyUrl: 'http://localhost:9998',
				logFile: 'log/proxy-%s.log', logLevel: 'trace'});
		});
	}
