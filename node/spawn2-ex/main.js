void function () {
	'use strict';

	module.exports = main;

	function *main(spawn) {
		var s = '';
		var eh = ' eh!? ';

		s = '1: Callback function ' + (yield function (cb) { setTimeout(cb, 200, null, '1'); });
		try { s += eh + (yield function (cb) { setTimeout(cb, 200, new Error('1')); }); }
		catch (e) { s += ', error ' + e; }
		console.log('*', 1, s);

		s = '2: Promise resolve ' + (yield Promise.resolve(2));
		try { s += eh + (yield Promise.reject(new Error('2'))); }
		catch (e) { s += ', reject ' + e; }
		console.log('*', 2, s);

		s = '3: Generator ' + (yield function *() { yield Promise.resolve(33); return 3; } ());
		try { s += eh + (yield function *() { throw new Error('3'); } ()); }
		catch (e) { s += ', error ' + e; }
		console.log('*', 3, s);

		s = '4: Generator function ' + (yield function *() { yield Promise.resolve(44); return 4; });
		try { s += eh + (yield function *() { throw new Error('4'); }); }
		catch (e) { s += ', error ' + e; }
		console.log('*', 4, s);

		s = '5: Array ' + JSON.stringify(yield [Promise.resolve(5)]);
		try { s += eh + JSON.stringify(yield [Promise.reject(new Error('5'))]); }
		catch (e) { s += ', error ' + e; }
		console.log('*', 5, s);

		s = '6: Object ' + JSON.stringify(yield {p:Promise.resolve(6)});
		try { s += eh + JSON.stringify(yield {p:Promise.reject(new Error('6'))}); }
		catch (e) { s += ', error ' + e; }
		console.log('*', 6, s);

		s = '';
		var t = '';
		try { s += ' undefined:' + (yield undefined);            } catch (e) { t += '\n' + e + ': undefined'; }
		try { s += ' null:'      + (yield null);                 } catch (e) { t += '\n' + e + ': null'; }
		try { s += ' 0:'         + (yield 0);                    } catch (e) { t += '\n' + e + ': 0'; }
		try { s += ' 1:'         + (yield 1);                    } catch (e) { t += '\n' + e + ': 1'; }
		try { s += ' true:'      + (yield true);                 } catch (e) { t += '\n' + e + ': true'; }
		try { s += ' false:'     + (yield false);                } catch (e) { t += '\n' + e + ': false'; }
		try { s += ' string:'    + (yield 'string');             } catch (e) { t += '\n' + e + ': string'; }
		try { s += ' RegExp:'    + (yield new RegExp('RegExp')); } catch (e) { t += '\n' + e + ': RegExp'; }
		try { s += ' Error:'     + (yield new Error('Error'));   } catch (e) { t += '\n' + e + ': Error'; }
		console.log('*', 0, s + t);

		throw new Error('x');
		return 'end';
	}
} ();
