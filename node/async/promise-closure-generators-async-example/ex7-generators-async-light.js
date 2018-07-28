// Node style callback (err, val) => void
const sleep = (msec, val, cb) => msec >= 0 ?
	setTimeout(cb, msec, null, val) :
	setTimeout(cb, -msec, new Error('sleep: ' + val));
sleep(100, 'A1', (err, val) => console.log(val));

// Thunk (thunkified)
// const delay = (msec, val) => cb => sleep(msec, val, cb);

// function thunkify(fn) {
// 	return function (...args) {
// 		return function (cb) {
// 			fn.apply(null, args.concat(cb));
// 		};
// 	};
// }

const thunkify = fn => (...args) => cb => fn.apply(null, args.concat(cb));
const delay = thunkify(sleep);
delay(150, 'A2')((err, val) => console.log(val));

// Promise (promisified)
// const wait = (msec, val) => new Promise((res, rej) =>
// 	sleep(msec, val, (err, val) => err ? rej(err) : res(val)));

const promisify = fn => (...args) => new Promise((res, rej) =>
	fn.apply(null, args.concat((err, val) => err ? rej(err) : res(val))));
const wait = promisify(sleep);
wait(200, 'A3')
	.then(val => console.log(val))
	.catch(err => console.log(err));

function* main() {
	try {
		var val = yield cb => sleep(300, 'B1', cb);
		console.log(val);
		console.log(yield cb => sleep(300, 'B2', cb));
		console.log(yield cb => sleep(300, 'B3', cb));

		val = yield delay(300, 'C1');
		console.log(val);
		console.log(yield delay(300, 'C2'));
		console.log(yield delay(300, 'C3'));

		val = yield wait(300, 'D1');
		console.log(val);
		console.log(yield wait(300, 'D2'));
		console.log(yield wait(300, 'D3'));

		console.log(yield [
			wait(333, 'E1'),
			wait(111, 'E2'),
			wait(222, 'E3'),
		]);

		console.log(yield [
			cb => sleep(333, 'G1', cb),
			delay(111, 'G2'),
			wait(222, 'G3'),
		]);

		console.log(yield *sub());
	}
	catch (e) { console.log('********', e); }
}

function *sub() {
	console.log(yield wait(111, 'H1'));
	console.log(yield wait(222, 'H2'));
	console.log(yield wait(333, 'H3'));
	return 'H4';
}

// function thunk2promise(val) {
// 	if (typeof val === 'function')
// 		return new Promise((res, rej) =>
// 			val((err, val) => err ? rej(err) : res(val)));
// 	else if (val && typeof val.then === 'function')
// 		return val;
// 	else
// 		return Promise.resolve(val);
// }

const thunk2promise = val =>
	typeof val === 'function' ?
		new Promise((res, rej) =>
			val((err, val) => err ? rej(err) : res(val))) :
	(val && typeof val.then === 'function') ? val :
	Promise.resolve(val);

function aa(gen) {
	proc();
	function proc(err, val) {
		try {
			var obj = err ? gen.throw(err) : gen.next(val);
			// {done, value}
		}
		catch (e) { console.log('***aa:', e); }

		if (obj.done) return; // END

		var data = obj.value;

		if (typeof data === 'function')
			data(proc);
		else if (data && typeof data.then === 'function')
			data.then(val => proc(null, val), proc);
		else if (Array.isArray(data))
			Promise.all(data.map(thunk2promise))
				.then(val => proc(null, val), proc);
		else proc(null, val);
	}
}

aa(main());
