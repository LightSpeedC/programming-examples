'use strict';

const {Writable} = require('stream');
//const Writable = require('stream').Writable;
const util = require('util');


class MyWritable extends Writable {
	constructor(options) {
		super(options);
	}
	_write(chunk, encoding, callback) {
		console.log('w1 write: ' + chunk, encoding);
		setTimeout(callback, 50);
	}
}


util.inherits(MyWritable5, Writable);
function MyWritable5(options) {
	if (!(this instanceof MyWritable5))
		return new MyWritable5(options);
	Writable.call(this, options);
}
MyWritable5.prototype._write = function (chunk, encoding, callback) {
	console.log('w5 write: ' + chunk, encoding);
	setTimeout(callback, 50);
};


const w1 = new MyWritable();
w1.on('finish', () => console.log('w1.finish'));
setTimeout(() => w1.write('w1.1'), 100);
setTimeout(() => w1.write('w1.2'), 200);
setTimeout(() => w1.write('w1.3'), 300);
setTimeout(() => w1.end(), 400);


const w5 = new MyWritable5();
w5.on('finish', () => console.log('w5.finish'));
setTimeout(() => w5.write('w5.1'), 100);
setTimeout(() => w5.write('w5.2'), 200);
setTimeout(() => w5.write('w5.3'), 300);
setTimeout(() => w5.end(), 400);


const w0 = new Writable({
	write(chunk, encoding, callback) {
		console.log('w0 write: ' + chunk, encoding);
		setTimeout(callback, 50);
	}
});
w0.on('finish', () => console.log('w0.finish'));
setTimeout(() => w0.write('w0.1'), 100);
setTimeout(() => w0.write('w0.2'), 200);
setTimeout(() => w0.write('w0.3'), 300);
setTimeout(() => w0.end(), 400);
