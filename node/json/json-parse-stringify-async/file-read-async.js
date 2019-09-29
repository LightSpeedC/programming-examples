// file-read-async

'use strict';

const fs = require('fs');
const INPUT_JSON_FILE = process.argv[2] || 'data.json.log';
const VARIANT = process.argv[3] || '';

const jsonStringifyAsync = require('./json-stringify-async' + VARIANT);
const jsonParseAsync = require('./json-parse-async');

async function main() {
	const chan = Channel();

	if (typeof gc === 'function') step('gc                             '), gc();
	step('read-start...                  ');
	fs.readFile(INPUT_JSON_FILE, chan);
	step('read-await...                  ');
	let buf = await chan;
	step('read-buf-received-conv-to-str  ');
	let str = buf.toString();
	buf = null;
	// if (typeof gc === 'function') step('gc                             '), gc();
	step('read-str-received-and-parse    ');
	// const json = await jsonParseAsync(str);
	let json = await JSON.parse(str);
	str = '';
	// if (typeof gc === 'function') step('gc                             '), gc();
	step('read-json-parsed-and-copy      ');
	let json2 = deepCopy(json);
	json = null;
	// if (typeof gc === 'function') step('gc                             '), gc();
	step('deep-copy-and-stringify        ');
	const str2 = await jsonStringifyAsync(json2);
	// const str2 = await JSON.stringify(json2);
	json2 = null;
	// if (typeof gc === 'function') step('gc                             '), gc();
	step('data-json-to-str               ');
	fs.writeFile(INPUT_JSON_FILE + '.log', str2, chan);
	await chan;
	step('write-file                     ');
}

let stepNo = 0;
let step1 = process.hrtime();
function step(str) {
	const delta = process.hrtime(step1);
	const mem = process.memoryUsage();
	console.log(getNow(), Delta(delta), '***', pad(++stepNo, 3), str,
		'rss:' + MB(mem.rss), 'heapTotal:' + MB(mem.heapTotal), 'heapUsed:' + MB(mem.heapUsed),
		'*****************');
	step1 = process.hrtime();
}

function deepCopy(obj) {
	if (obj == null) return obj;
	switch (typeof obj) {
		case 'boolean':
		case 'number':
		case 'string':
			return obj;
		case 'object':
			if (obj.constructor === Object) {
				let result = {};
				for (let key in obj)
					result[key] = deepCopy(obj[key]);
				return result;
			}
			else if (obj.constructor === Array) {
				let result = [];
				for (let i = 0; i < obj.length; ++i)
					result[i] = deepCopy(obj[i]);
				return result;
			}
			else
				throw new Error('eh!? ' + typeof obj + ' ' + obj.constructor.name);
		default:
			throw new Error('eh!? ' + typeof obj);
	}
}

function pad(n, m) {
	const s = String(n);
	return (' '.repeat(m - s.length) + s);
}

function getNow(dt = new Date()) {
	return dt.toLocaleDateString() + ' ' + dt.toLocaleTimeString();
}

function Delta(delta) {
	return ('        ' + (delta[0] * 1e3 + delta[1] / 1e6).toFixed(3)).substr(-10) + ' msec';
}

function MB(x) {
	return ('       ' + (x / 1024 / 1024).toFixed(3)).substr(-9) + ' MB';
}

function Channel() {
	const vals = [], cbs = [];

	chan.then = (res, rej) =>
		chan((err, val) => err ? rej ? rej(err) : err : res ? res(val) : val);
	return chan;

	function chan(cb) {
		typeof cb === 'function' ? cbs.push(cb) : vals.push(arguments);
		while (cbs.length && vals.length)
			cbs.shift().apply(null, vals.shift());
	}
}
function Channel2() {
	const a = [], b = [];

	h.then = (f, g) => h((e, d) => e ? g ? g(e) : e : f ? f(d) : d);
	return h;

	function h(c) {
		typeof c === 'function' ? b.push(c) : a.push(arguments);
		while (a.length && b.length) b.shift().apply(null, a.shift());
	}
}

async function test() {
	for (let i = 0; i < 3; ++i) {
		console.log('-----------------------------------------------------------');
		const hrtime = process.hrtime();
		await main();
		console.log(getNow(), Delta(process.hrtime(hrtime)));
	}
}

test().catch(err => console.log(new Date(), err));

// main().catch(err => console.log(new Date(), err));
