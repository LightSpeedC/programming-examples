const co3 = gfn => cb => (gen =>
		function next(err, val) {
			try { var ret = err ? gen.throw(err) : gen.next(val); }
			catch(e) { if (cb) return cb(e); throw e; }
			ret.done ? cb && cb(null, ret.value) :
			typeof ret.value === 'function' ? ret.value(next) :
			ret.value && ret.value.then ?
				ret.value.then(val => next(null, val), next) :
			next(null, ret.value);
		} ())(gfn());

co3(function *() {
	try {
		console.log('111');
		yield cb => setTimeout(cb, 100);
		console.log('222');
		yield cb => setTimeout(cb, 100/*, new Error('custom')*/);
		console.log('333');
		yield Promise.resolve(444);
	} catch (e) {
		console.log(e + '');
	}
})((err, val) => console.log('*****\nerr: ' + err, 'val: ' + val));
