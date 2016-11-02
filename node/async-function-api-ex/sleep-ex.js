// sleep([opts,] msec, [val], [cb])

'use strict';

var slice = [].slice;
function sleep(opts, msec, val, cb) {
	var args = slice.call(arguments);

	cb = typeof args[args.length - 1] === 'function' ?
		args.pop() : null;
	if (typeof cb !== 'function')
		throw new TypeError('function cb must specify!');

	opts = typeof args[0] === 'object' ? args.shift() : {};
	msec = args.shift();
	val = args.shift();

	if (!(msec >= 0))
		throw new TypeError('number msec must specify');

	setTimeout(cb, msec, null, val);
}

function delay(opts, msec, val) {
	var ctx = this, args = arguments;
	return function (cb) {
		args[args.length++] = cb;
		sleep.apply(ctx, args);
	};
}

function wait(opts, msec, val) {
	var ctx = this, args = arguments, res, rej;
	var p = new Promise(function (res1, rej1) { res = res1; rej = rej1; });
	args[args.length++] = function (err, val) {
		err ? rej(err) : res(val);
	};
	sleep.apply(ctx, args);
	return p;
}

sleep.thunk = delay;
sleep.promise = wait;

sleep(1000, 'cb',
	(err, val) => console.log('sleep1', err, val));
delay(1000, 'thunk')
	((err, val) => console.log('delay1', err, val));
wait(1000, 'promise')
	.then(val => console.log('wait-1', val),
		err => console.log('wait1e', err));
wait(1500, 'promise')
	.then(val => console.log('wait15', val))
	.catch(err => console.log('wait15e', err));
sleep(1600, () => console.log());

sleep(2000,
	(err, val) => console.log('sleep2', err, val));
delay(2000)
	((err, val) => console.log('delay2', err, val));
wait(2000)
	.then(val => console.log('wait-2', val),
		err => console.log('wait2e', err));
wait(2500)
	.then(val => console.log('wait25', val))
	.catch(err => console.log('wait25e', err));
sleep(2600, () => console.log());

sleep({}, 3000,
	(err, val) => console.log('sleep3', err, val));
delay({}, 3000)
	((err, val) => console.log('delay3', err, val));
wait({}, 3000)
	.then(val => console.log('wait-3', val),
		err => console.log('wait3e', err));
wait({}, 3500)
	.then(val => console.log('wait35', val))
	.catch(err => console.log('wait35e', err));

//sleep((err, val) => console.log('sleep', err, val));
//delay()((err, val) => console.log('delay', err, val));
//wait()
//	.then(val => console.log('wait', val))
//	.catch(err => console.log('wait-e', err));
