// code-conv-test.js
// 文字コード変換

// @ts-check
'use strict';

const fs = require('fs');
const path = require('path');

const IN_DIR = './code-conv-data';
const OUT_DIR = './code-conv-logs';

let deltaDateNow = Date.now();
function delta() {
	const deltaDateNowNext = Date.now();
	const ret = sec(deltaDateNowNext - deltaDateNow);
	deltaDateNow = deltaDateNowNext;
	return ret;
}

const CodeConv = require('../code-conv');
console.log('load maps:', delta());

function testSj2Uni(dir, file, outDir) {
	delta();
	const buffSj = fs.readFileSync(path.resolve(dir, file));
	console.log('read file:', delta());

	const strUni = CodeConv.convSj2UniSync(buffSj);
	console.log('conv s2u :', delta());
	fs.writeFileSync(path.resolve(outDir, file + '-sj2uni.log'), strUni);
	console.log('write    :', delta());

	const buffSj2 = CodeConv.convUni2SjSync(strUni);
	console.log('conv u2s :', delta());
	fs.writeFileSync(path.resolve(outDir, file + '-uni2sj.log'), buffSj2);
	console.log('write    :', delta());
}

function testUni2Sj(dir, file, outDir) {
	delta();
	const buffUni = fs.readFileSync(path.resolve(dir, file));
	console.log('read file:', delta());

	const buffSj = CodeConv.convUni2SjSync(buffUni);
	console.log('conv u2s :', delta());
	fs.writeFileSync(path.resolve(outDir, file + '-uni2sj.log'), buffSj);
	console.log('write    :', delta());

	const strUni = CodeConv.convSj2UniSync(buffSj);
	console.log('conv s2u :', delta());
	fs.writeFileSync(path.resolve(outDir, file + '-sj2uni.log'), strUni);
	console.log('write    :', delta());

	const buffSj2 = CodeConv.convUni2SjSync(strUni);
	console.log('conv u2s :', delta());
	fs.writeFileSync(path.resolve(outDir, file + '-uni2sj2.log'), buffSj2);
	console.log('write    :', delta());
}

function sec(ms) {
	return (ms / 1000.0).toFixed(3) + ' sec';
}

function main() {
	try { fs.mkdirSync(OUT_DIR); }
	catch (err) { err.code === 'EEXIST' || console.error(err); }


	testSj2Uni(IN_DIR, 'code-conv-test-sj.txt', OUT_DIR);
	testUni2Sj(IN_DIR, 'code-conv-test-uni.txt', OUT_DIR);
	testUni2Sj(IN_DIR, 'code-conv-test-uni2.txt', OUT_DIR);
}

main();
