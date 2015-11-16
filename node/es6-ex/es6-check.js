// http://qiita.com/_shimizu/items/1dd5dd0f9f88f96188ef

(function () {
	'use strict';

	var features = [
		[108, 'Map',
				'(function() { var x = new Map(); return 108; })()'],

		[108, 'Set',
				'(function() { var x = new Set(); return 108; })()'],

		[108, 'WeakMap',
				'(function() { var x = new WeakMap(); return 108; })()'],

		[108, 'WeakSet',
				'(function() { var x = new WeakSet(); return 108; })()'],

		[107, 'const',
				'(function() { "use strict"; const foo = 107; return foo; })()'],

		[109, 'Promise',
				'(function() { return new Promise(function () {}) instanceof Promise ? 109 : 0; })()'],

		[101, 'generators/yield',
				'(function*() { yield 101; })().next().value'],

		[102, 'arrow function',
				'(()=>{ return 102; })()'],

		[103, 'variable parameters/rest parameters',
				'(function(...args) { return args[0]; })(103)'],

		[104, 'defult parameters',
				'(function(a = 104) { return a; })()'],

		[105, 'let',
				'(function() { "use strict"; var foo = 105; { let foo = 106; } return foo; })()']
	];

	for (var i = 0; i < features.length; ++i) {
		try {
			if (eval(features[i][2]) !== features[i][0])
				throw new Error('no ' + features[i][1]);
			console.info('o: ' + features[i][1] + ' enabled');
		} catch (e) { console.error('x: ' + features[i][1] + ' disabled:', e) }
	}

})();
