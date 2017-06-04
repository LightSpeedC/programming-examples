const wait = ms => cb => setTimeout(cb, ms);

const spawn = gtor => cb => function next(err, val) {
	try {
		const { value, done } = err ? gtor.throw(err) : gtor.next(val);
		done ? cb && cb(null, value) :
			!value ? next(null, value) :
				typeof value === 'function' ? value(next) :
					// value.then ? value.then(val => next(null, val), next) :
					next(null, value);
	} catch (err) { cb && cb(err) || console.error(err); }
}();

const Channel = (r = [], s = []) =>
	(e, v) => ((typeof e === 'function' ? r.push(e) : s.push([e, v])),
		r.length && s.length && r.shift().apply(undefined, s.shift()));

const chanA = Channel(), chanB = Channel();

spawn(function* () {
	console.log('thread1: start...');
	yield wait(1000);
	console.log('thread1: send...');
	chanA(null, { content: 'Hello World' });
	yield chanB;
	console.log('thread1: end');
}())();

spawn(function* () {
	console.log('thread2: start...');
	yield wait(2000);
	const msg = yield chanA;
	console.log('thread2: recv:', msg.content);
	chanB(null, 'end');
	console.log('thread2: end');
}())();
