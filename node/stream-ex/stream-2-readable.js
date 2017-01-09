'use strict';

const {Readable} = require('stream');
//const Readable = require('stream').Readable;
const util = require('util');


class MyReadable extends Readable {
	constructor(options) {
		super(options);
		this.buffs = ['r1.1', 'r1.2', 'r1.3'];
	}
	_read(size) {
		console.log('r1 read');
		setTimeout(() => this.push(this.buffs.shift() || null), 100);
	}
}


util.inherits(MyReadable5, Readable);
function MyReadable5(options) {
	if (!(this instanceof MyReadable5))
		return new MyReadable5(options);
	Readable.call(this, options);
	this.buffs = ['r5.1', 'r5.2', 'r5.3'];
}
MyReadable5.prototype._read = function (size) {
	console.log('r5 read');
	setTimeout(() => this.push(this.buffs.shift() || null), 100);
};


const r1 = new MyReadable();
r1.on('end', () => console.log('r1.end'));
r1.on('data', data => console.log('r1.data: ' + data));


const r5 = new MyReadable5();
r5.on('end', () => console.log('r5.end'));
r5.on('data', data => console.log('r5.data: ' + data));


const r0 = new Readable({
	read(size) {
		console.log('r0 read');
		setTimeout(() => this.push(this.buffs.shift() || null), 100);
	}
});
r0.on('end', () => console.log('r0.end'));
r0.on('data', data => console.log('r0.data: ' + data));
r0.buffs = ['r0.1', 'r0.2', 'r0.3'];
