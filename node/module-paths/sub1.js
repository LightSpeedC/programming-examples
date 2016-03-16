	'use strict';
	console.log('\x1b[32m*************sub1.js****************\x1b[m');
	try { require('sub2'); } catch (e) { console.log('\x1b[41m', e, '\x1b[m'); }
	module.paths.unshift(__dirname);
	//require.main.paths.unshift(__dirname);
	try { require('sub2'); } catch (e) { console.log('\x1b[41m', e, '\x1b[m'); }
