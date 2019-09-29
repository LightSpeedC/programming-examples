// web-switch

process.title = 'web-switch';

const http = require('http');
const net = require('net');
const url = require('url');
const fs = require('fs');
const INDENT = '    ';
const DateTime = require('./date-time-string');

const globalConfig = {log: true, services: {}};
const servers = {};

let agentNo = 0;

// ファイル監視
fs.watch('./config.json', reloadConfig);

// コンフィグを再読込み
let timer;
function reloadConfig(event, filename) {
	timer && clearTimeout(timer);
	timer = setTimeout(readConfig, 100);
}

// コンフィグを読む
function readConfig() {
	fs.readFile('./config.json', function (err, buf) {
		if (err) return console.error(getNow(), 'config.json: ' + err);
		try {
			const config = bufferToConfig(buf);
			Object.keys(globalConfig.services).forEach(key => {
				if (!config.services[key]) {
					stopServer(key);
					delete globalConfig.services[key];
				}
			});
			Object.keys(config.services).forEach(key => {
				const before = globalConfig.services[key];
				globalConfig.services[key] = config.services[key];
				if (!before) startServer(key);
			});
		} catch (err) {
			console.error(getNow(), 'config.json: ' + err.stack);
		}
	});
}

function bufferToConfig(buf) {
	var str = buf.toString();
	const gblcfg = JSON.parse(str);
	const dt = getNow();
	console.log();
	console.log(dt, 'config: ' + inspect(gblcfg, dt + ' '));
	console.log();
	Object.keys(gblcfg.services).forEach(key => {
		const paths = gblcfg.services[key];
		if (!paths['*']) return delete gblcfg.services[key];
		const cfg = gblcfg.services[key] = {paths};

		cfg.port = Number(key);
		if (cfg.port !== cfg.port) return delete gblcfg.services[key];

		Object.keys(paths).forEach(k => {
			// console.log(getNow(), k);
			paths[k] = url.parse(paths[k]); });
		// console.log(getNow(), JSON.stringify(cfg, null, '  '));
	});
	// console.log(getNow(), JSON.stringify(gblcfg, null, '  '));
	return gblcfg;
}

function getNow() {
	return DateTime.toDateTimeString();
}

readConfig();

function startServer(key) {
	console.log(getNow(), 'starting port:', key);
	const config = globalConfig.services[key], paths = config.paths;

	// console.log(key, config.port, paths);
	if (Object.keys(paths).join('') === '*') {
		servers[key] = net.createServer({allowHalfOpen: false}, c => {
			const config = globalConfig.services[key], paths = config.paths;
			const {port, hostname} = paths['*'];
			const s = net.connect(port, hostname);
			c.pipe(s); s.pipe(c);
			c.on('error', e => {e.code === 'ECONNRESET' || console.log(getNow(), 'c:' + e); c.end(), s.end();});
			s.on('error', e => {e.code === 'ECONNRESET' || console.log(getNow(), 's:' + e); c.end(), s.end();});
			c.on('end', () => s.end());
			s.on('end', () => c.end());
			// c.on('end', () => (s.end(), console.log(getNow(), 'c.end')));
			// s.on('end', () => (c.end(), console.log(getNow(), 's.end')));
		})
		.listen(config.port, () =>
			console.log(getNow(), 'started  port:', key));

		return;
	}

	servers[key] = http.createServer((cliReq, cliRes) => {
		const config = globalConfig.services[key], paths = config.paths;
		// ↑外側で宣言した変数を必ず再代入しないとclosureとなるので必須
		const cliSoc = cliReq.socket;
		const x = url.parse(cliReq.url);
		if (globalConfig.log) {
			console.log();
			console.log(getNow(), config.port + ' ' + config.paths['*'].host);
			console.log(getNow(),
				cliReq.method, cliReq.url, '→ #', cliSoc.$agentNo);
		}
		var y, xx = x.pathname.split('/');
		var opt = {method: cliReq.method, path: x.path,
			headers: cliReq.headers, agent: cliSoc.$agent};
		if (xx.length >= 2) {
			y = paths[xx[1]];
			if (y) opt.path = y.path + x.path.slice(xx[1].length + 1);
		}
		if (!y) {
			y = paths['*'];
			opt.path = (y.path === '/' ? '' :y.path) + x.path;
		}
		opt.host = y.hostname;
		opt.port = y.port || 80;
		if (globalConfig.log) console.log(getNow(),
			opt.method, opt.path, '→', opt.host + ':' + opt.port);

		const svrReq = http.request(opt, svrRes => {
			svrRes.headers['max-age'] = '30';
			cliRes.writeHead(svrRes.statusCode, svrRes.headers);
			svrRes.pipe(cliRes); });
		cliReq.pipe(svrReq);
		svrReq.on('error', err => {
			cliRes.writeHead(500,
				{'content-header': 'text/plain; charset=utf-8'})
			cliRes.end(err + '');
		});
		cliReq.on('error', err => {
			cliRes.writeHead(500,
				{'content-header': 'text/plain; charset=utf-8'})
			cliRes.end(err + '');
		});
	})
	.on('connection', function onConnection(cliSoc) {
		cliSoc.$agent = new http.Agent({keepAlive: true});
		cliSoc.$agent.on('error', err =>
			console.log(getNow(), 'agent:', err.stack));
		cliSoc.$agentNo = ++agentNo;
	})
	.listen(config.port, () =>
		console.log(getNow(), 'started  port:', key));
} // startServer

function stopServer(key) {
	console.log(getNow(), 'shutdown port:', key);
	console.log(getNow(), require('util').inspect(globalConfig));
	const config = globalConfig.services[key];

	try {
		servers[key].close();
		servers[key] = null;
	} catch (err) {
		const dt = getNow();
		console.log(dt, err.stack);
		console.log(dt, 'servers[' + key + ']:', servers[key] != null);
	}
} // stopServer

// inspect
function inspect(obj, indent) {
	if (!indent) indent = '';
	switch (typeof obj) {
		case 'undefined':
			// return '\x1b[90mundefined\x1b[m'; // gray
		case 'number':
		case 'boolean':
			// return '\x1b[33m' + obj + '\x1b[m'; // yellow
			return obj + '';
		case 'string':
			// return '\x1b[32m' + obj + '\x1b[m'; // green
			return JSON.stringify(obj);
		case 'function':
		case 'object':
			if (obj === null) return 'null'; // bold
				// return '\x1b[32mnull\x1b[m'; // bold
			if (obj.constructor === Array)
				return '[' + obj.map(x =>
					'\r\n' + indent + INDENT +
					inspect(x, indent + INDENT)
				).join(',') + ']';
			// Object
			return '{' + Object.keys(obj).map(k =>
				'\r\n' + indent + INDENT + k + ': ' +
				// '\x1b[36m' + k + '\x1b[m: ' +
				inspect(obj[k], indent + INDENT)
			).join(',') + '}';
		default:
			return obj + '';
	}
}
