const F = 'function', N = 'number';
const wait = (msec, val) => new Promise(res => setTimeout(res, msec, val));

function aa(g, h) {
	return arguments.length === 0 ? Channel() : !g ? Promise.resolve(g) :
		typeof g.then === F ? g : typeof g === N ? wait(g, h) :
			g.constructor === Array ? Promise.all(g.map(aa)) :
				typeof g === F || typeof g.next === F ?
					new Promise((res, rej) => {
						g = typeof g === F ? g((e, v) => e ? rej(e) : res(v)) : g;
						g && typeof g.next === F && function cb(e, v) {
							try {
								arguments.length === 1 && !(e instanceof Error) && (v = e, e = null);
								v = e ? g.throw(e) : g.next(v);
								v.done ? typeof v.value === N ? res(v.value) : aa(v.value).then(res, rej) :
									aa(v.value).then(v => cb(null, v), cb);
							} catch (e) { rej(e); }
						}();
					}) : Promise.resolve(g);
}

aa.wait = wait;
aa.Channel = Channel;
function Channel() {
	const sends = [], recvs = [];
	return function channel(e, v) {
		typeof e === F ? recvs.push(e) : sends.push(arguments);
		if (recvs.length > 0 && sends.length > 0) {
			const args = sends.shift(), cb = recvs.shift();
			(args.length === 1 && !(args[0] instanceof Error)) ?
				cb.call(null, null, args[0]) :
				cb.apply(null, args);
		}
	};
}


aa(function* () {
	console.log('aa 100');
	console.log('aa 100', yield Promise.resolve(100));
	console.log('aa 110');
	console.log('aa 110', yield wait(500, 110));
	console.log('aa 120');
	console.log('aa 120', yield function* () { return yield Promise.resolve(120); }());
	console.log('aa 130');
	console.log('aa 130', yield function* () { return yield Promise.resolve(130); });
	console.log('aa 140');
	console.log('aa 140', yield cb => setTimeout(cb, 500, 140));
	console.log('aa 150');
	console.log('aa 500', yield 500);
	console.log('aa 160');
	const chan = aa();
	setTimeout(chan, 100, 100);
	setTimeout(chan, 200, 200);
	console.log('aa 200');
	console.log('aa chan 100', yield chan);
	console.log('aa 210');
	console.log('aa chan 200', yield chan);
	console.log('aa 220');
	console.log('aa 999');
	yield aa(undefined);
	yield aa(null);
	yield aa(true);
	yield aa(false);
	yield aa(0);
	yield aa('');
	console.log('aa a00');
});
