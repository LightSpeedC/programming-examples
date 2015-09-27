console.time('sequential');

console.log('console.log');
console.info('console.info');
if (console.debug)
	console.debug('console.debug');
console.warn('console.warn');
console.error('console.error');

if (console.setStyle) {
	console.setStyle('error', {color: 'white', backgroundColor: 'red'});
	console.setStyle('warn',  {color: 'white', backgroundColor: 'orange'});
	console.setStyle('debug', {color: 'white', backgroundColor: 'blue'});
}

console.log('console.log');
console.info('console.info');
if (console.debug)
	console.debug('console.debug');
console.warn('console.warn');
console.error('console.error');

console.trace('trace test');

console.timeEnd('sequential');

console.time('timer');
setTimeout(function () {
	console.timeEnd('timer');
}, 1000);

console.dir({x:1,y:2});
