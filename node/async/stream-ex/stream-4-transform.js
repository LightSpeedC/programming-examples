'use strict';

const {Transform} = require('stream');
//const Transform = require('stream').Transform;
const util = require('util');

const mode = new Date().getMilliseconds() % 2;
console.log('mode:', ['callback', 'push'][mode]);


class MyTransform extends Transform {
	constructor(options) {
		super(options);
	}
	_transform(chunk, encoding, callback) {
		const prev = 'x1 transform: ' + chunk;
		for(let i = 0; i < chunk.length; i++)
			chunk[i]++;
		console.log(prev + ' -> ' + chunk, encoding);
		if (mode)
			setTimeout(() => { this.push(chunk); callback(); }, 50);
		else
			setTimeout(callback, 50, null, chunk);
	}
	_flush(callback) {
		this.push(new Buffer('[EOF]'));
		setTimeout(callback, 50);
	}
}


util.inherits(MyTransform5, Transform);
function MyTransform5(options) {
	if (!(this instanceof MyTransform5))
		return new MyTransform5(options);
	Transform.call(this, options);
}
MyTransform5.prototype._transform = function (chunk, encoding, callback) {
	const prev = 'x5 transform: ' + chunk;
	for(let i = 0; i < chunk.length; i++)
		chunk[i]++;
	console.log(prev + ' -> ' + chunk, encoding);
	if (mode)
		setTimeout(() => { this.push(chunk); callback(); }, 50);
	else
		setTimeout(callback, 50, null, chunk);
};
MyTransform5.prototype._flush = function(callback) {
	this.push(new Buffer('[EOF]'));
	setTimeout(callback, 50);
};


const x1 = new MyTransform();
x1.on('end', () => console.log('x1.end'));
x1.on('data', data => console.log('x1.data: ' + data));
x1.on('finish', () => console.log('x1.finish'));
setTimeout(() => x1.write('x1.1'), 100);
setTimeout(() => x1.write('x1.2'), 200);
setTimeout(() => x1.write('x1.3'), 300);
setTimeout(() => x1.end(), 400);


const x5 = new MyTransform5();
x5.on('end', () => console.log('x5.end'));
x5.on('data', data => console.log('x5.data: ' + data));
x5.on('finish', () => console.log('x5.finish'));
setTimeout(() => x5.write('x5.1'), 100);
setTimeout(() => x5.write('x5.2'), 200);
setTimeout(() => x5.write('x5.3'), 300);
setTimeout(() => x5.end(), 400);


const x0 = new Transform({
	transform(chunk, encoding, callback) {
		const prev = 'x0 transform: ' + chunk;
		for(let i = 0; i < chunk.length; i++)
			chunk[i]++;
		console.log(prev + ' -> ' + chunk, encoding);
		if (mode)
			setTimeout(() => { this.push(chunk); callback(); }, 50);
		else
			setTimeout(callback, 50, null, chunk);
	},
	flush(callback) {
		this.push(new Buffer('[EOF]'));
		setTimeout(callback, 50);
	}
});
x0.on('end', () => console.log('x0.end'));
x0.on('data', data => console.log('x0.data: ' + data));
x0.on('finish', () => console.log('x0.finish'));
setTimeout(() => x0.write('x0.1'), 100);
setTimeout(() => x0.write('x0.2'), 200);
setTimeout(() => x0.write('x0.3'), 300);
setTimeout(() => x0.end(), 400);
