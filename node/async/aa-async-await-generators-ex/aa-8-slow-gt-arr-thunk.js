const F = 'function', aa = g => g.constructor === Array ? all(g) : cb => (typeof g.then === F ? g :
	typeof g === F || typeof g.next === F ? new Promise((Y, N) => {
		if (!(g = typeof g === F ? g((e, v) => e ? N(e) : Y(v)) : g) || typeof g.next !== F) return;
		(function z(e, v) { try { v = e ? g.throw(e) : g.next(v); if (v.done) return Y(v.value);
			aa(v.value)(z); } catch (e) { N(e); } })(); }) : Promise.resolve(g)).then(v => cb(null, v), cb);
const all = arr => (cb, n, r) => ((n = arr.length) ? (r = new Array(n), arr.forEach((v, i, z) => (
	z = (e, v) => e ? (cb(e), n = 0) : (r[i] = v, --n || cb(null, r)),
	typeof v === F ? (v = v(z), v && v.next && aa(v)(z)) : aa(v)(z)))) : cb(null, []));
// const t2promise = t => new Promise((res, rej) => t((e, v) => e ? rej(e) : res(v)));
// const p2thunk = p => cb => p.then(v => cb(null, v), cb);

aa(function *() {
	console.log('aaa');
	yield cb => setTimeout(cb, 1000);
	console.log('bbb');
	console.log('ccc', yield [
		cb => setTimeout(cb, 1000, null, 'A'),
		function (cb) { setTimeout(cb, 100, null, 'B'); },
		function *() { return 'C'; },
		function *() { return 'D'; } (),
	]);
	/*
	yield cb => setTimeout(cb, 500);
	console.log('ddd', yield {
		a: cb => setTimeout(cb, 1000, null, 'A'),
		b: function (cb) { setTimeout(cb, 100, null, 'B'); },
		c: function *() { return 'C'; },
		d: function *() { return 'D'; } (),
	});
	*/
	yield cb => setTimeout(cb, 1000);
	console.log('eee', yield []);
	yield cb => setTimeout(cb, 1000);
	console.log('fff', yield {});
	yield cb => setTimeout(cb, 1000);
	console.log('ggg', yield 'ggg');
})((e, v) => e ? console.log('fin err:', e) : console.log('fin val:', v));
