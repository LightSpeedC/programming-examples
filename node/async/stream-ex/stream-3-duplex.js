'use strict';

const {Duplex} = require('stream');
//const Duplex = require('stream').Duplex;
const util = require('util');


class MyDuplex extends Duplex {
	constructor(options) {
		super(options);
		this.buffs = ['d1.1', 'd1.2', 'd1.3'];
	}
	_read(size) {
		console.log('d1 read');
		setTimeout(() => this.push(this.buffs.shift() || null), 100);
	}
	_write(chunk, encoding, callback) {
		console.log('d1 write: ' + chunk, encoding);
		setTimeout(callback, 50);
	}
}


util.inherits(MyDuplex5, Duplex);
function MyDuplex5(options) {
	if (!(this instanceof MyDuplex5))
		return new MyDuplex5(options);
	Duplex.call(this, options);
	this.buffs = ['d5.1', 'd5.2', 'd5.3'];
}
MyDuplex5.prototype._read = function (size) {
	console.log('d5 read');
	setTimeout(() => this.push(this.buffs.shift() || null), 100);
};
MyDuplex5.prototype._write = function (chunk, encoding, callback) {
	console.log('d5 write: ' + chunk, encoding);
	setTimeout(callback, 50);
};


const d1 = new MyDuplex();
d1.on('end', () => console.log('d1.end'));
d1.on('data', data => console.log('d1.data: ' + data));
d1.on('finish', () => console.log('d1.finish'));
setTimeout(() => d1.write('d1.1'), 100);
setTimeout(() => d1.write('d1.2'), 200);
setTimeout(() => d1.write('d1.3'), 300);
setTimeout(() => d1.end(), 400);


const d5 = new MyDuplex5();
d5.on('end', () => console.log('d5.end'));
d5.on('data', data => console.log('d5.data: ' + data));
d5.on('finish', () => console.log('d5.finish'));
setTimeout(() => d5.write('d5.1'), 100);
setTimeout(() => d5.write('d5.2'), 200);
setTimeout(() => d5.write('d5.3'), 300);
setTimeout(() => d5.end(), 400);


const d0 = new Duplex({
	read(size) {
		console.log('d0 read');
		setTimeout(() => this.push(this.buffs.shift() || null), 100);
	},
	write(chunk, encoding, callback) {
		console.log('d0 write: ' + chunk, encoding);
		setTimeout(callback, 50);
	}
});
d0.on('end', () => console.log('d0.end'));
d0.on('data', data => console.log('d0.data: ' + data));
d0.buffs = ['d0.1', 'd0.2', 'd0.3'];
d0.on('finish', () => console.log('d0.finish'));
setTimeout(() => d0.write('d0.1'), 100);
setTimeout(() => d0.write('d0.2'), 200);
setTimeout(() => d0.write('d0.3'), 300);
setTimeout(() => d0.end(), 400);
