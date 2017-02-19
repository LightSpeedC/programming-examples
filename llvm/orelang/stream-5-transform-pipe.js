'use strict';

const {Transform} = require('stream');
//const Transform = require('stream').Transform;
const util = require('util');

const mode = new Date().getMilliseconds() % 2;
console.log('mode:', ['callback', 'push'][mode]);


class MyTransform extends Transform {
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


util.inherits(MyTransform5, Transform);
function MyTransform5(options) {
	if (!(this instanceof MyTransform5))
		return new MyTransform5(options);
	Transform.call(this, options);
}
MyTransform5.prototype._transform = function (chunk, encoding, callback) {
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
};
MyTransform5.prototype._flush = function (callback) {
	if (this.buff && this.buff.length > 0)
		this.push(this.buff);
	callback();
};


const x1 = new MyTransform();
x1.on('end', () => console.log('x1.end'));
x1.on('data', data => console.log('x1.data: ' + data));
x1.on('finish', () => console.log('x1.finish'));
setTimeout(() => x1.write('x1.1\n'), 100);
setTimeout(() => x1.write('x1.2\n'), 200);
setTimeout(() => x1.write('x1.3\n'), 300);
setTimeout(() => x1.end(), 400);


const x5 = new MyTransform5();
x5.on('end', () => console.log('x5.end'));
x5.on('data', data => console.log('x5.data: ' + data));
x5.on('finish', () => console.log('x5.finish'));
setTimeout(() => x5.write('x5.1\n'), 100);
setTimeout(() => x5.write('x5.2\n'), 200);
setTimeout(() => x5.write('x5.3\n'), 300);
setTimeout(() => x5.end(), 400);


const x0 = new Transform({
	transform(chunk, encoding, callback) {
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
	},
	flush(callback) {
		if (this.buff && this.buff.length > 0)
			this.push(this.buff);
		callback();
	}
});
x0.on('end', () => console.log('x0.end'));
x0.on('data', data => console.log('x0.data: ' + data));
x0.on('finish', () => console.log('x0.finish'));
setTimeout(() => x0.write('x0.1\n'), 100);
setTimeout(() => x0.write('x0.2\n'), 200);
setTimeout(() => x0.write('x0.3\n'), 300);
setTimeout(() => x0.end(), 400);
