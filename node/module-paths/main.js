	'use strict';
	console.log('\x1b[32m*************main.js****************\x1b[m');
	//x('module', module);
	function x(n, o) {
		console.log(n);
		console.log(o);
		console.log();
	}

	try { require('sub1'); } catch (e) { console.log('\x1b[41m', e, '\x1b[m'); }
	module.paths.unshift(__dirname);
	//require.main.paths.unshift(__dirname);
	try { require('sub1'); } catch (e) { console.log('\x1b[41m', e, '\x1b[m'); }
	//x('module', module);
