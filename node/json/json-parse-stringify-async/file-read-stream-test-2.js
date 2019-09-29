'use strict';

const fs = require('fs');
const readline = require('readline');

const rs = fs.createReadStream('data.json.log');

const ls = readline.createInterface(rs);

let cnt = 0;

ls.on('line', line => ++cnt);
ls.on('error', err => console.error(err));
ls.on('close', () => console.log('close', cnt));

