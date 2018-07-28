var co = require(process.argv[2] || 'co');
var next = require('./next');

if (typeof co.wrap !== 'function')
	return console.log('co.wrap not supported!');

var fn = co.wrap(function* (val) {
  return yield Promise.resolve(val);
});

console.log(typeof fn +
	((fn && typeof fn.then === 'function') ? ' .then' : '') +
	((fn && typeof fn.next === 'function') ? ' .next' : '') +
	(' : ' + fn).replace(/(\t|\r|\n| )+/g, ' '));

next(fn(true));
