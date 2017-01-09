'use strict';

const {Transform} = require('stream');


class NewLineSplitter extends Transform {
	constructor(options) {
		super(Object.assign({writableObjectMode: true}, options));
		this.buff = null;
	}
	_transform(chunk, encoding, callback) {
		chunk = Buffer.from(chunk);
		if (chunk.length === 0) return callback();

		chunk = this.buff ? Buffer.concat([this.buff, chunk]) : chunk;

		let pos = 0;
		for(let i = 0; i < chunk.length; i++) {
			if (chunk[i] === 0x0a) {
				this.push(chunk.slice(pos, i + 1));
				pos = i + 1;
			}
		}

		pos === 0 ? this.buff = chunk :
		pos >= chunk.length ? this.buff = null :
		this.buff = chunk.slice(pos);

		callback();
	}
	_flush(callback) {
		if (this.buff && this.buff.length > 0)
			this.push(this.buff);
		callback();
	}
}


module.exports = NewLineSplitter;

/*
const x1 = new NewLineSplitter();
x1.on('end', () => console.log('x1.end'));
x1.on('data', data => console.log('x1.data: ' + data));
x1.on('finish', () => console.log('x1.finish'));
setTimeout(() => x1.write('x1\n.1'), 100);
setTimeout(() => x1.write('x1\n.2'), 200);
setTimeout(() => x1.write('x1\n.3'), 300);
setTimeout(() => x1.end(), 400);
*/
