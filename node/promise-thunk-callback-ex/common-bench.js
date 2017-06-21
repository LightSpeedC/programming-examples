function commonBench(Base) {
	'use strict';

	Base.bench || (Base.bench = bench);

	function bench(name) {
		console.log('benchmark:', name);

		var p;

		p = Base(function (cb) {
			setTimeout(function () { console.log('1a:OK?'); cb(null, '1b:OK!'); }, 1000);
		}, (err, val) => (console.log('1c:end:', err, val), '1d:end'));
		if (p && typeof p.then === 'function')
			p.then(val => console.log('no cb style val:', val),
				err => console.log('no cb style err:', err));

		p = Base(function (cb) {
			setTimeout(() => (console.log('2a:OK?'), cb(null, '2b:OK!')), 1100);
		});
		if (typeof p === 'function')
			p((err, val) => (console.log('2c:end:', err, val), '2d:end'))
				((err, val) => (console.log('2e:end:', err, val), '2f:end'));
		else if (p && typeof p.then === 'function')
			p.then(val => console.log('no thunk style val:', val),
				err => console.log('no thunk style err:', err));

		Base(function (cb) {
			setTimeout(() => (console.log('3a:OK?'), cb(null, '3b:OK!')), 1200);
		})
			.then(val => (console.log('3c:val:', val), '3d:end'))
			.then(val => (console.log('3g:val:', val), '3h:end'))
			.catch(err => (console.log('3e:err:', err), '3f:end'));

		p = Base(function (cb) {
			// throw new Error('err1!');
			setTimeout(() => (console.log('4a:OK?'), cb(null, '4b:OK!')), 1300);
		}, true)
		if (typeof p === 'function')
			p((err, val) => (console.log('4c:end:', err, val), '4d:end'))
				((err, val) => (console.log('4e:end:', err, val), '4f:end'));

		Base(function (cb) {
			// throw new Error('err2!');
			setTimeout(() => (console.log('5a:OK?'), cb(null, '5b:OK!')), 1400);
		}, true)
			.then(val => (console.log('5c:val:', val), '5d:end'))
			.then(val => (console.log('5g:val:', val), '5h:end'))
			.catch(err => (console.log('5e:err:', err), '5f:end'));

		Base.aa(function* () {
			console.log('6a: 2000', yield Base.wait(2000, 2000));
			console.log('6a: 1000', yield Base.wait(1000, 1000));
			return '6a:end';
		})
			.then(val => (console.log('6c:val:', val), '6d:end'))
			.then(val => (console.log('6g:val:', val), '6h:end'))
			.catch(err => (console.log('6e:err:', err), '6f:end'));

	} // bench

	return Base;
};

if (typeof module === 'object' && module && module.exports)
	module.exports = commonBench;
