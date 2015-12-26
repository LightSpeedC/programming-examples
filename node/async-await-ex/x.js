aa4 = require('./aa4');
aa = require('aa');

console.log('aa4:A', Object.keys(aa4).sort().join(' '));
console.log('aa :A', Object.keys(aa).sort().join(' '));

console.log('aa4:B', Object.getOwnPropertyNames(aa4).sort().join(' '));
console.log('aa :B', Object.getOwnPropertyNames(aa).sort().join(' '));
