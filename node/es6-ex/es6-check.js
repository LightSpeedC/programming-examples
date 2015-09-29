// http://qiita.com/_shimizu/items/1dd5dd0f9f88f96188ef

try {
	if (eval('(function*() { yield 101; })().next().value') === 101)
		console.info('o yield enabled');
	else throw Error('unexpected generators yield value');
} catch (e) { console.error('x yield disabled:', e) }

try {
	if (eval('(()=>{ return 102; })()') === 102)
		console.info('o arrow function enabled');
	else throw Error('unexpected arrow function return value');
} catch (e) { console.error('x arrow function disabled:', e) }

try {
	if (eval('(function(...args) { return args[0]; })(103)') === 103)
		console.info('o variable arguments/rest arguments enabled');
	else throw Error('unexpected variable arguments value');
} catch (e) { console.error('x variable arguments/rest arguments disabled:', e) }

try {
	if (eval('(function(a = 104) { return a; })()') === 104)
		console.info('o default arguments enabled');
	else throw Error('unexpected default argument value');
} catch (e) { console.error('x default arguments disabled:', e) }

try {
	if (eval('(function() { "use strict"; var foo = 105; {let foo = 106; } return foo; })()') === 105)
		console.info('o let enabled');
	else throw Error('unexpected let value');
} catch (e) { console.error('x let disabled:', e) }

try {
	if (eval('(function() { "use strict"; const foo = 107; return foo; })()') === 107)
		console.info('o const enabled');
	else throw Error('unexpected const value');
} catch (e) { console.error('x const disabled:', e) }

try {
	eval('(function() { var myMap = new Map(); })()');
	console.info('o Map enabled');
} catch (e) { console.error('x Map disabled:', e) }
