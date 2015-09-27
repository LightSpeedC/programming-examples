// http://qiita.com/_shimizu/items/1dd5dd0f9f88f96188ef

try {
	eval('(function*() { yield 101 })().next().value');
	console.info('o yield enabled');
} 
catch (e) { console.error('x yield disabled:', e) }

try {
	eval('(function(a=10) { return a })()');
	console.info('o default arguments enabled');
} 
catch (e) { console.error('x default arguments disabled:', e) }

try {
	eval('(function(...args) { return args; })()');
	console.info('o variable arguments/rest arguments enabled');
} 
catch (e) { console.error('x variable arguments/rest arguments disabled:', e) }

try {
	eval('(()=>{ return null })();');
	console.info('o arrow function enabled');
} 
catch (e) { console.error('x arrow function disabled:', e) }

try {
	eval('(function() { "use strict"; var foor = 2; {let foo = 1; return foo; } })()');
	console.info('o let enabled');
} 
catch (e) { console.error('x let disabled:', e) }

try {
	eval('(function() { "use strict"; const foo = 1; })()');
	console.info('o const enabled');
} 
catch (e) { console.error('x const disabled:', e) }

try {
	eval('(function() { var myMap = new Map(); })()');
	console.info('o Map enabled');
} 
catch (e) { console.error('x Map disabled:', e) }
