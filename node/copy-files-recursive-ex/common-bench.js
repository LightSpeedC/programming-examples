'use strict';

module.exports = function (Base) {

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
			setTimeout(() => (console.log('2a:OK?'), cb(null, '2b:OK!')), 1000);
		});
		if (typeof p === 'function')
			p((err, val) => (console.log('2c:end:', err, val), '2d:end'))
				((err, val) => (console.log('2e:end:', err, val), '2f:end'));
		else if (p && typeof p.then === 'function')
			p.then(val => console.log('no thunk style val:', val),
				err => console.log('no thunk style err:', err));

		Base(function (cb) {
			setTimeout(() => (console.log('3a:OK?'), cb(null, '3b:OK!')), 1000);
		})
			.then(val => (console.log('3c:val:', val), '3d:end'))
			.then(val => (console.log('3g:val:', val), '3h:end'))
			.catch(err => (console.log('3e:err:', err), '3f:end'));

		p = Base(function (cb) {
			// throw new Error('err1!');
			setTimeout(() => (console.log('2a:OK?'), cb(null, '2b:OK!')), 1000);
		}, true)
		if (typeof p === 'function')
			p((err, val) => (console.log('2c:end:', err, val), '2d:end'))
				((err, val) => (console.log('2e:end:', err, val), '2f:end'));

		Base(function (cb) {
			// throw new Error('err2!');
			setTimeout(() => (console.log('3a:OK?'), cb(null, '3b:OK!')), 1000);
		}, true)
			.then(val => (console.log('3c:val:', val), '3d:end'))
			.then(val => (console.log('3g:val:', val), '3h:end'))
			.catch(err => (console.log('3e:err:', err), '3f:end'));

		Base.aa(function* () {
			console.log('100', yield Base.wait(100, 100));
			console.log('200', yield Base.wait(200, 200));
			return '4a:end';
		})
			.then(val => (console.log('4c:val:', val), '4d:end'))
			.then(val => (console.log('4g:val:', val), '4h:end'))
			.catch(err => (console.log('4e:err:', err), '4f:end'));

	} // bench

	return Base;
};
