// next-tick-2018.js

const fs = require('fs');

const MAX_DEPTH = 1;
const delay = 3;

const msgs = [];
let uid = 0;

const startTime = typeof process === 'object' && process && typeof process.hrtime === 'function' ?
	process.hrtime() : new Date();

const deltaTime = typeof process === 'object' && process && typeof process.hrtime === 'function' ?
	function delta(startTime) {
		const delta = process.hrtime(startTime);
		return padLeft((delta[0] * 1e3 + delta[1] / 1e6).toFixed(6), 10) + 'ms';
	} :
	function delta(startTime) {
		return padLeft(((new Date() - startTime) / 1e3).toFixed(3), 5) + 'ms';
	};

// fs.readFile(__filename, () => test({name: 'file0', depth: 0, id: ++uid}));
setTimeout(test, 0, {name: 'main0', depth: 0, id: ++uid});

function padLeft(s, n) {
	return '                    '.substr(0, n - String(s).length) + s;
}

function test({name, depth, id}) {
	msgs.push('id:' + padLeft(id, 4) + ' ' + deltaTime(startTime) + ' ' + depth + ' ' + name);

	if (++depth > MAX_DEPTH) return;

	//fs.readFile(__filename, () => test(
	//	{name: name + ' file1', depth, id: ++uid}));
	setTimeout(test, delay,
		{name: name + ' main1', depth, id: ++uid});
	setTimeout(test, 0,
		{name: name + ' time1', depth, id: ++uid});
	setImmediate(test,
		{name: name + ' immd1', depth, id: ++uid});
	Promise.resolve(
		{name: name + ' rslv1', depth, id: ++uid}).then(test);
	process.nextTick(test,
		{name: name + ' next1', depth, id: ++uid});

	//fs.readFile(__filename, () => test(
	//	{name: name + ' file2', depth, id: ++uid}));
	setTimeout(test, delay,
		{name: name + ' main2', depth, id: ++uid});
	setTimeout(test, 0,
		{name: name + ' time2', depth, id: ++uid});
	setImmediate(test,
		{name: name + ' immd2', depth, id: ++uid});
	Promise.resolve(
		{name: name + ' rslv2', depth, id: ++uid}).then(test);
	process.nextTick(test,
		{name: name + ' next2', depth, id: ++uid});
}


setTimeout(() => msgs.forEach(x => console.log(x)), 1000);
