'use strict';

let lastID = 0;
let uniqObjID = 100;
const uniqObjs = new WeakMap();
function getUniq(obj) {
	let x = uniqObjs.get(obj);
	if (!x) uniqObjs.set(obj, x = (++uniqObjID) + ': ' + typeof obj);
	return x;
}

const path = require('path');
const fs = require('fs');
const events = require('events');

main();

async function main() {
	await test1();
	async function test1() {
		const chan = Channel();

		setTimeout(chan, 200, null, 111);
		setTimeout(chan, 400, null, 222);
		setTimeout(chan, 600, new Error('err'), 333);
		console.log('test1: a', await chan);
		console.log('test1: b', await chan);
		try {
			console.log('test1: c', await chan);
		} catch (err) {
			console.log('test1: c err: ' + err);
		}
	}

	await test2();
	async function test2() {
		const chan = Channel();

		setTimeout(chan, 400, null, 444);
		setTimeout(chan, 200, null, 555);
		console.log('test2: d', await chan, '!?');
		console.log('test2: e', await chan, '!?');			
	}

	await test3();
	async function test3() {
		const chan = Channel();

		let timer = setInterval(chan, 100);
		for (let i = 0; i < 5; ++i) {
			await chan;
			console.log('test3: interval timer:', i);
		}
		clearInterval(timer);
	}

	const file = __filename, basename = path.basename(file);

	await test4();
	async function test4() {
		const chan = Channel();

		fs.readFile(file, chan);
		const buf1 = await chan;
		console.log('test4: length:', buf1.length, basename);
	
		const buf2 = await (fs.readFile(file, chan), chan);
		console.log('test4: length:', buf2.length, basename);
	}

	await test5();
	async function test5() {
		const chan = Channel();

		const stream = fs.createReadStream(file);
		stream.pipe(chan);
		let buf;
		while(buf = await chan) {
			console.log('test5:', typeof buf);
		}
	}

	await test6();
	async function test6() {
		const chan = Channel();

		const stream = fs.createWriteStream('b.log');
		chan.pipe(stream);
		chan(null, Buffer.from('a\r\n'));
		chan(null, Buffer.from('b\r\n'));
	}

	await test7();
	async function test7() {
		const chan = Channel();

		const stream1 = fs.createReadStream(file);
		const stream2 = fs.createWriteStream('a.log');
		stream1.pipe(chan).pipe(stream2);
	}

	await test8();
	async function test8() {
		const chan = Channel();
		const stream = fs.createReadStream(file);
		stream.pipe(chan);
		let buf;
		while(buf = await chan) {
			console.log('test8:', typeof buf);
		}
	}

	await test9();
	async function test9() {
		const chan = Channel();
		const stream = fs.createReadStream(file);
		stream.on('error', chan);
		stream.on('data', chan.write);
		stream.on('end', chan.end);
		let buf;
		while(buf = await chan) {
			console.log('test9:', typeof buf);
		}
	}
}

function Channel() {
	const ID = ++lastID;
	const callbacks = [], values = [];

	channel.ID = ID;
	// promise methods
	channel.then = then;
	channel['catch'] = caught;
	// channel.resolve = value => channel(null, value);

	// channel.next = value => channel(null, value);
	// channel.throw = error => channel(error);

	// suport for stream pipe methods
	channel.on = on;
	channel.once = once;
	channel.write = data => channel(null, data);
	channel.end = () => channel(null);
	channel.emit = emit;
	channel.pipe = pipe;
	// channel.status = () => 'callbacks: ' + callbacks.length + ', values: ' + values.length;

	return channel;

	function channel(first) {
		typeof first === 'function' ? callbacks.push(first) : values.push(arguments);
		callbacks.length && values.length &&
			(callbacks.shift()).apply(channel, values.shift());
		return channel;
	}
}

function then(res, rej) {
	return this(cb);

	function cb(err, val) {
		if (err) rej && rej(err);
		else res && res(val);
	}
}

function caught(rej) {
	return this.then(undefined, rej);
}

function on(event, listener) {
	switch (event) {
		case 'unpipe': console.log('chan' + this.ID + ': on unpipe,', getUniq(listener));
		case 'drain': console.log('chan' + this.ID + ': on drain,', getUniq(listener));
		case 'error': console.log('chan' + this.ID + ': on error,', getUniq(listener));
		default: console.log('chan' + this.ID + ': on ' + event + ',', getUniq(listener));
	}
	return this;
}

function once(event, listener) {
	switch (event) {
		case 'close': console.log('chan' + this.ID + ': once close,', getUniq(listener));
		case 'finish': console.log('chan' + this.ID + ': once finish,', getUniq(listener));
		default: console.log('chan' + this.ID + ': once ' + event + ',', getUniq(listener));
	}
	// return this;
}	


function emit(event, ...args) {
	switch (event) {
		case 'pipe': console.log('chan' + this.ID + ': emit pipe', getUniq(args[0]));
		default: console.log('chan' + this.ID + ': emit ' + event, getUniq(args[0]));
	}
	return this;
}

// // function write(data) {
// function write(...args) {
// 	this.call(this, null, ...args);
// 	return this;
// }

function pipe(stream) {
	// stream.on('error', ...);
	const channel = this;
	setTimeout(() => channel(cb), 0);
	stream.on('error', err => console.log('stream error', err));
	function cb(err, val) {
		if (err) {
			stream.emit('error', err);
		}
		else {
			if (arguments.length === 1 || typeof val === 'undefined')
				return stream.end();
			else 
				stream.write(val);
		}
		setTimeout(() => channel(cb), 0);
	}
 	return stream;
}

// function callback() {
// 	var args = arguments;
// 	function cb() {
// 		var chan = Channel();
// 		return chan;	
// 	}
// }
