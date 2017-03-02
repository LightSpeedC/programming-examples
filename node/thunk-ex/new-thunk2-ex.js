void function () {
	'use struct';

	const Thunk = require('new-thunk/thunk2');
	const aa = Thunk.aa;

	function delay(ms, val) {
		console.log('delay', ms, val);
		return new Thunk(cb => setTimeout(cb, ms, null, val));
	}

	delay(500, 'a')
	((err, val) => err ? err : delay(500, 'b'))
	((err, val) => err ? err : delay(500, 'c'))
	((err, val) => err ? err : delay(500, 'd'))
	((err, val) => err ? console.error(err) : null);

	setTimeout(aa(function *() {
		console.log('aa start');
		yield delay(500, 'd0');
		var a = yield Thunk.all([delay(200, 'd1'), delay(100, 'd2'), delay(300, 'd3')]);
		console.log(a);
		var b = yield Thunk.all({x:delay(200, 'd1'), y:delay(100, 'd2'), z:delay(300, 'd3')});
		console.log(b);
	}), 2500, function () { console.log('aa end'); });

} ();
