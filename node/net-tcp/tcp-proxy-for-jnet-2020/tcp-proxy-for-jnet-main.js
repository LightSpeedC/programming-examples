'use strict';

const fs = require('fs');

const config = require('./config');
const tcpProxyAsync = require('./tcp-proxy');

main(config).catch(err => console.error(err));

async function main(config) {
	console.log(require('util').inspect(config, {depth: null}));
	await tcpProxyAsync(config);
}
