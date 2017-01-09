// csv-parser

'use strict';

const util = require('util');
const url = require('url');
const fs = require('fs');
const aa = require('./aa-local');
const NewLineSplitter = require('./new-line-splitter');
const {Transform} = require('stream');

/*
function normalize(args) {
	return args.length === 1 ?
		args[0] instanceof Error ? args : [null, args[0]] : args;
}
*/

function Channel() {
	const vals = [], cbs = [];
	return channel;
	function channel(cb) {
		typeof cb === 'function' ? cbs.push(cb) : vals.push(arguments);
		while (cbs.length && vals.length)
			cbs.shift().apply(null, vals.shift());
	}
}

function num(n) {
	let m = Number(n);
	return m == n ? m : n;
}

class CsvParser extends Transform {
	constructor(options) {
		super(Object.assign({readableObjectMode: true, writableObjectMode: true}, options));
		const parseHeader = Object.assign({parseHeader: false}, options).parseHeader;
		let header = null;
		this.x = new NewLineSplitter()
			.on('data', data => parseHeader ?
				header ?
				this.push(data.toString().trim().split(',')
					.reduce((a, c, i) => (a[header[i]] = num(c), a), {})) :
				header = data.toString().trim().split(',') :
				this.push(data.toString().trim().split(',').map(num)));
	}
	_transform(chunk, encoding, callback) {
		this.x.write(chunk, encoding, callback);
	}
	_flush(callback) {
		this.x.end();
		callback();
	}
}

function parseCsv(file, cb) {
	aa(function *() {
		var uri = url.parse(file);

		const chan = Channel();
		fs.createReadStream(file)
			.pipe(new CsvParser({parseHeader: true})
				.on('data', chan)
				.on('end', chan));

		let line, lines = [];
		while (line = yield chan) {
			console.log(util.inspect(line, {colors: true, depth: null}));
			lines.push(line);
		}

		return lines;
	})(cb);
}


function parseCsv2(file, cb) {
	aa(function *() {
		//var uri = url.parse(file);
		const buf = yield cb => fs.readFile(file, cb);
		const lines = buf.toString().trim().split('\n').map(x => x.trim());
		const header = lines[0].split(',');
		const body = lines.slice(1)
			.map(x => x.split(',')
				.reduce((a, x, i) => (a[header[i]] = num(x), a), {}));
		body.forEach(x =>
			console.log(util.inspect(x, {colors: true, depth: null})));

		return body;
	})(cb);
}

if (require.main === module) {
	parseCsv(process.argv[2] || 'table1.csv',
		(err, result) => console.log(err, result && result.length));
}
