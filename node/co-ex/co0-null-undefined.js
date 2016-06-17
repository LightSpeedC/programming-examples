var co = require(process.argv[2] || 'co');

co(function *() {

  console.log('\nundefined');
  yield co().then(function (value) {
    console.log(value);
  }, function (err) {
    console.error(err.stack);
  });

  console.log('\nnull');
  yield co(null).then(function (value) {
    console.log(value);
  }, function (err) {
    console.error(err.stack);
  });

});
