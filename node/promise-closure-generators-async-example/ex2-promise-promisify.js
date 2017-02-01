function getA(params, cb) {
	setTimeout(function () {
		// console.log('data:' + params);
		cb(null, 'data:' + params);
	}, 1000);
}

// function getAp(params) {
// 	return new Promise((resolve, reject) =>
// 		getA(params, (err, data) =>
// 			err ? reject(err) : resolve(data)));
// }

// function promisify(fn) {
// 	return function promisified(...args) {
// 		return new Promise((res, rej) => {
// 			args.push((err, val) => err ? rej(err) : res(val));
// 			fn.apply(null, args);
// 		})
// 	};
// }

// const promisify = fn => (...args) =>
// 	new Promise((res, rej) => {
// 		args.push((err, val) => err ? rej(err) : res(val));
// 		fn.apply(null, args);
// 	});

const promisify = fn => (...args) => new Promise((res, rej) =>
	fn.apply(null, args.concat((err, val) => err ? rej(err) : res(val))));

const getAp = promisify(getA);

getAp('AAA')
	.then(data => (console.log(data), getAp('BBB')))
	.then(data => (console.log(data), getAp('CCC')))
	.then(data => console.log(data))
	.catch(err => (console.error(err), Promise.reject(err)))
	.catch(err => console.error(err));

console.log('start');
