const co3 = gen => (cb =>
	function x(err, val) {
		try { var obj = err ? gen.throw(err) : gen.next(val); }
		catch (err) { if (cb) return cb(err); throw err; }
		(val = obj.value, obj.done) ? cb && cb(null, val) :
		typeof val === 'function' ? val(x) :
		val && val.then ? val.then(val => x(null, val), x) :
		x(null, val);
	} ())();
const aa = gen => new Promise((res, rej) =>
	function x(err, val) {
		try { var obj = err ? gen.throw(err) : gen.next(val); }
		catch (err) { return rej(err); }
		(val = obj.value, obj.done) ? res(val) :
		typeof val === 'function' ? val(x) :
		val && val.then ? val.then(val => x(null, val), x) :
		x(null, val);
	} ());
aa.callback = gfn => function () {
	return aa(gfn.apply(this, arguments));
};
