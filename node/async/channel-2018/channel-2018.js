main();

async function main() {
	const chan = Channel();

	setTimeout(chan, 200, null, 111);
	setTimeout(chan, 400, null, 222);
	setTimeout(chan, 600, new Error('err'), 333);
	console.log('a', await chan);
	console.log('b', await chan);
	try {
		console.log('c', await chan);
	} catch (err) {
		console.log('c err:', err);
	}
}

function Channel() {
	var recvs = [], sends = [];

	channel.then = then;
	channel['catch'] = caught;

	return channel;

	function channel(first) {
		if (typeof first === 'function')
			recvs.push(first);
		else
			sends.push(arguments);
		if (recvs.length && sends.length)
			(recvs.shift()).apply(channel, sends.shift());
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
