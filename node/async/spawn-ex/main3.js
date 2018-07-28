void function () {
	'use strict';

	module.exports = main;

	function *main(spawn) {
		var s = '';
		var eh = ' eh!? ';

		s = '1: Callback function   '  + (yield spawn(function (cb) { setTimeout(cb, 200, null, '1'); }));
		try { s += eh + (yield spawn(function (cb) { setTimeout(cb, 200, new Error('1')); })); }
		catch (e) { s += ', error ' + e; }
		console.log('*', 1, s);

		s = '2: Promise resolve     ' + (yield spawn(Promise.resolve(2)));
		try { s += eh + (yield spawn(Promise.reject(new Error('2')))); }
		catch (e) { s += ', error ' + e; }
		console.log('*', 2, s);

		s = '3: Generator           ' + (yield spawn(function *() { yield Promise.resolve(33); return 3; } ()));
		try { s += eh + (yield spawn(function *() { throw new Error('3'); } ())); }
		catch (e) { s += ', error ' + e; }
		console.log('*', 3, s);

		s = '4: Generator function  ' + (yield spawn(function *() { yield Promise.resolve(44); return 4; }));
		try { s += eh + (yield spawn(function *() { throw new Error('4'); })); }
		catch (e) { s += ', error ' + e; }
		console.log('*', 4, s);

		s = '5: Array ' + JSON.stringify(yield spawn([
			function (cb) { setTimeout(cb, 200, null, 5); },
			Promise.resolve(5),
			function *() { yield Promise.resolve(55); return 5; } (),
			function *() { yield Promise.resolve(55); return 5; },
			[], {}
		]));
		try { s += eh + JSON.stringify(yield [Promise.reject(new Error('5'))]); }
		catch (e) { s += ', error ' + e; }
		console.log('*', 5, s);

		s = '6: Object ' + JSON.stringify(yield spawn({
			f:function (cb) { setTimeout(cb, 200, null, 6); },
			p:Promise.resolve(6),
			g:function *() { yield Promise.resolve(66); return 6; } (),
			h:function *() { yield Promise.resolve(66); return 6; },
			a:[], o:{}
		}));
		try { s += eh + JSON.stringify(yield {p:Promise.reject(new Error('6'))}); }
		catch (e) { s += ', error ' + e; }
		console.log('*', 6, s);

		return 'end';
	}
} ();
