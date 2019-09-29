'use strict';

const fs = require('fs');
const readline = require('readline');

const rs = fs.createReadStream('data.json.log');
const ws = fs.createWriteStream('data.json2.log');

/*
const lens = {};

rs.on('data', data => {
	// console.log('data', data.length);
	const len = data.length;
	if (!lens[len]) lens[len] = 0;
	++lens[len];
	ws.write(data);
});
rs.on('error', err => console.error(err));
rs.on('end', () => {
	console.log('end', lens);
	ws.end();
});
*/

const ls = readline.createInterface(rs);

let cnt = 0;
let wcnt = 0;
let bufs = [];

function flush() {
	ws.write(bufs.join(''));
	++wcnt;
	bufs = [];
}

ls.on('line', line => {
	++cnt;
	bufs.push(line + '\n');
	if (bufs.length >= 5e3) flush();
});
ls.on('error', err => console.error(err));
ls.on('close', () => {
	if (bufs.length > 0) flush();
	ws.end();
	console.log('close', cnt, wcnt);
});
