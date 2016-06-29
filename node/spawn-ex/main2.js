void function () {
	'use strict';

	module.exports = main;

	function *main(spawn) {
		var s = '', t = '';
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
	}
} ();
