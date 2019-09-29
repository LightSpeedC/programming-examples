// file-read-batch

'use strict';

const fs = require('fs');
const INPUT_JSON_FILE = process.argv[2] || 'data.json.log';

async function main() {
	const chan = Channel();

	step('read-start...                  ');
	fs.readFile(INPUT_JSON_FILE, chan);
	step('read-await...                  ');
	const buf = await chan;
	step('read-buf-received-conv-to-str  ');
	const str = buf.toString();
	step('read-str-received-and-parse    ');
	const json = JSON.parse(str);
	step('read-json-parsed-and-stringify ');
	const str2 = JSON.stringify(json);
	step('data-json-to-str               ');
}

let stepNo = 0;
let step1 = process.hrtime();
function step(str) {
	const delta = process.hrtime(step1);
	const dt = new Date();
	const dts = dt.toLocaleDateString() + ' ' + dt.toLocaleTimeString();
	const mem = process.memoryUsage();
	console.log(dts + ' ' + Delta(delta) + ' *** ' + ++stepNo + ' ' + str +
		', rss:' + MB(mem.rss) +
		', heapTotal:' + MB(mem.heapTotal) +
		', heapUsed:' + MB(mem.heapUsed) +
		' *****************');
	step1 = process.hrtime();
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

main().catch(err => console.log(new Date(), err));
