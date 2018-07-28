void function (counts) {
	console.log('xxx', counts);
	var time = Date.now();
	next();
	function next(err) {
		console.log('yyy', counts);
		if (err) console.log('finished:', err, (Date.now() - time) / 1000, 'sec');
		var i = 0, N = counts.shift();
		console.log(N);
		if (!N) return;
		var p = Promise.resolve(i);
		loop(i);
		function loop(k) {
			console.log(i, k);
			if (i !== k) throw new Error('eh? i ' + i + ' !== k ' + k);
			p = p.then(loop, next);
			return ++i < N ? Promise.resolve(i) : Promise.reject(i);
		}
	}
}([1e5, 1e5, 1e5, 1e6, 2e6, 1e7]);
