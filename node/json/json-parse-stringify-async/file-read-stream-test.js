'use strict';

const fs = require('fs');
const readline = require('readline');

const rs = fs.createReadStream('data.json.log');

const lens = {};

/*
rs.on('data', data => {
	// console.log('data', data.length);
	const len = data.length;
	if (!lens[len]) lens[len] = 0;
	++lens[len];
});
rs.on('error', err => console.error(err));
rs.on('end', () => console.log('end', lens));
*/

const ls = readline.createInterface(rs);

let cnt = 0;

ls.on('line', line => ++cnt);
ls.on('error', err => console.error(err));
ls.on('close', () => console.log('close', cnt));

