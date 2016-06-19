var co = require(process.argv[2] || 'co');
var next = require('./next');

next(co(function () {
  console.log('123');
  return 'abc';
}));
