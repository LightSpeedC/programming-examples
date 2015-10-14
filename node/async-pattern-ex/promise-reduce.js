	// wait (promise)
	function wait(ms, arg) {
		return new Promise(function (res, rej) {
			setTimeout(res, ms, arg);
		});
	}

	function catchError(err) { console.error('error: ', err); }

	var time0 = Date.now();

	// do parallel
	Promise.all([
		wait(600, 'a00'),
		wait(550, 'a01'),
		wait(500, 'a02'),
		wait(450, 'a03')
	]).then(function (values) {
		console.log('values:', values.join(', '));
		console.log('time: ', Date.now() - time0, 'msec');
	}, catchError);

	// do sequential
	var results2 = [];
	[
		[wait, 800, 'a20'],
		[wait, 750, 'a21'],
		[wait, 700, 'a22'],
		[wait, 650, 'a23']
	].reduce(function (a, b) {
		return a.then(function (val) {
			if (val) {
				console.log('a:', val);
				results2.push(val);
			}
			return b[0](b[1], b[2]);
			// return b[0].apply(null, [].slice.call(b, 1));
		}, catchError);
	}, Promise.resolve()).then(function (val) {
		console.log('b:', val);
		results2.push(val);
		console.log('results:', results2.join(', '));
		console.log('time: ', Date.now() - time0, 'msec');
	}, catchError);

	// do parallel
	var results1 = [];
	[
		wait(700, 'a10'),
		wait(650, 'a11'),
		wait(600, 'a12'),
		wait(550, 'a13')
	].reduce(function (a, b) {
		return a.then(function (val) {
			if (val) {
				console.log('a:', val);
				results1.push(val);
			}
			return b;
		}, catchError);
	}, Promise.resolve()).then(function (val) {
		console.log('b:', val);
		results1.push(val);
		console.log('results:', results1.join(', '));
		console.log('time: ', Date.now() - time0, 'msec');
	}, catchError);
