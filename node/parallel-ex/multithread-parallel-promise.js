const wait = ms => new Promise(res => setTimeout(res, ms));

const spawn = gtor => new Promise((res, rej) => function next(err, val) {
	try {
		const { value, done } = err ? gtor.throw(err) : gtor.next(val);
		const res2 = val => next(null, val);
		done ? res(value) :
			!value ? next(null, value) :
				// typeof value === F ? value(next) :
				value.constructor === Array ? Promise.all(value).then(res2, next) :
					value.then ? value.then(res2, next) :
						next(null, value);
	} catch (err) { rej(err); }
}());

function Channel() {
	const a = [], b = [];
	function thunk(e, v) {
		typeof e === 'function' ? a.push(e) : b.push([e, v]);
		a.length && b.length && a.shift().apply(undefined, b.shift());
	}
	thunk.then = (res, rej) => thunk((err, val) => err ?
		(rej && rej(err) || err) : (res && res(val) || val));
	return thunk;
}

const chanA = Channel(), chanB = Channel();
spawn(function* () {
	console.log('thread1: start...');
	yield wait(1000);
	console.log('thread1: send...');
	chanA(null, { content: 'Hello World' });
	yield chanB;
	console.log('thread1: end');
}());

spawn(function* () {
	console.log('thread2: start...');
	yield wait(2000);
	const msg = yield chanA;
	console.log('thread2: recv:', msg.content);
	chanB(null, 'end');
	console.log('thread2: end');
}());
