// http://qiita.com/_shimizu/items/1dd5dd0f9f88f96188ef

try {
	eval('(function*() { yield 1 })()');
	console.log('%c%s', 'color:green', 'yield を使えます');
} 
catch (e) { console.log('%c%s', 'color:red', 'yield は使えません') }


try {
	eval('(function*(a=10) { return a })()');
	console.log('%c%s', 'color:green', 'デフォルト引数 を使えます');
} 
catch (e) { console.log('%c%s', 'color:red', 'デフォルト引数 は使えません') }

try {
	eval('(function*(...numbers) { return numbeers })()');
	console.log('%c%s', 'color:green', '可変引数 を使えます');
} 
catch (e) { console.log('%c%s', 'color:red', '可変引数 は使えません') }

try {
	eval('(()=>{ return null })();');
	console.log('%c%s', 'color:green', 'アローファンクション を使えます');
} 
catch (e) { console.log('%c%s', 'color:red', 'アローファンクション は使えません') }

try {
	eval('(function*() { let foo = 1 })()');
	console.log('%c%s', 'color:green', 'let を使えます');
} 
catch (e) { console.log('%c%s', 'color:red', 'let は使えません') }

try {
	eval('(function*() { const foo = 1 })()');
	console.log('%c%s', 'color:green', 'const を使えます');
} 
catch (e) { console.log('%c%s', 'color:red', 'const は使えません') }

try {
	eval('(function*() { var myMap = new Map(); })()');
	console.log('%c%s', 'color:green', 'Map を使えます');
} 
catch (e) { console.log('%c%s', 'color:red', 'Map は使えません') }
