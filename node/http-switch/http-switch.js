// http-switch.js

'use strict';

const fs = require('fs');
const util = require('util');
const http = require('http');
const url = require('url');

const fsWatch = require('./fs-watch');

const CONFIG_FILE = 'config-' + process.env.USERDOMAIN + '.js';

function printData(data) {
	console.log(util.inspect(data, {colors: true, depth: null}));
}

// http.createServer();
fsWatcher('change', CONFIG_FILE);
fsWatch(CONFIG_FILE, fsWatcher);

function fsWatcher(event, file) {
	console.log(fsWatcher.name, event, file);
	fs.readFile(CONFIG_FILE, (err, buff) => {
		const data = eval(buff.toString());
		// printData(data);
		printData(data.ports);
		reloadPorts(data.ports);
	});
}

const httpServers = {};
const httpTransfers = {};
const reqAgents = new WeakMap();

function reloadPorts(newPorts) {
	Object.keys(httpServers)
		.forEach(port => {
			if (!newPorts[port]) {
				httpServers[port].close();
				delete httpServers[port];
				delete httpTransfers[port];
			}
		});

	Object.keys(newPorts)
		.forEach(port => {
			httpTransfers[port] =
				Object.keys(newPorts[port])
					.sort((a, b) => a.length < b.length ? 1 : a.length > b.length ? -1 :
						a > b ? 1 : a < b ? -1 : 0)
					.reduce((obj, pathname) => {
						const x = url.parse(newPorts[port][pathname]);
						obj[pathname] = {hostname: x.hostname, port: x.port || '80', pathname: x.pathname};
						return obj;
					}, {});
			printData({port, xfer: httpTransfers[port]});
			if (!httpServers[port]) {
				httpServers[port] = http.createServer((req, res) => {
					// req.socket
					Object.keys(httpTransfers[port])
						.some(pathname => {
							if (pathname === req.url.substr(0, pathname.length)) {
								const xx = httpTransfers[port][pathname];
								const newPath = xx.pathname + req.url.substr(pathname.length);
								console.log(newPath);
								req.pipe(http.request({method: req.method, 
									host: xx.hostname, port: xx.port, 
									path: newPath,
									headers: req.headers,
								},
									res2 => {
										res.writeHead(res2.statusCode,
											res2.statusMessage,
											res2.headers);
										console.log(res2.statusCode,
											res2.statusMessage,
											res2.headers);
										res2.pipe(res);
									}));
								return true;
							}
						})
				}).listen(port);
			}
		});
	
}

/*
> url.parse('http://google.com:1234/?#')
Url {
  protocol: 'http:',
  slashes: true,
  auth: null,
  host: 'google.com:1234',
  port: '1234',
  hostname: 'google.com',
  hash: '#',
  search: '?',
  query: '',
  pathname: '/',
  path: '/?',
  href: 'http://google.com:1234/?#' }

  hostname, port, pathname
*/
