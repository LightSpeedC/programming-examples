var co = require(process.argv[2] || 'co');

co(function () {
  console.log('123');
  return 'abc';
})
.then(
  val => console.log(val),
  err => console.error(err.stack));
