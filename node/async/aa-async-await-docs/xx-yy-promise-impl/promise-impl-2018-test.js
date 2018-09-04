'use strict';

const PromiseImpl = require('./promise-impl-2018');

benchmarkPromise('a', PromiseImpl);
benchmarkPromise('A', PromiseImpl);
benchmarkPromise('b', Promise);
benchmarkPromise('B', Promise);

function benchmarkPromise(name, PromiseClass) {
	console.log(name + '0: start');

	const p = new PromiseClass((res, rej) => res(name + '0'))
		.then(v => (console.log(name + '1:', v, 'val'), name + '1'))
		.catch(e => { console.log(name + '3:', e, 'err'); throw name + '3'; })
		.then(v => console.log(name + '5:', v, 'val'), e => console.log(name + '6:', e, 'err'));

	if (p.finally) p.finally(() => console.log(name + '9: finally'));
	else p.then(() => console.log(name + '9: finally'), () => console.log(name + '9: finally'));

	console.log(name + '0: started');
}

setTimeout(() => console.log('END'), 1000);
