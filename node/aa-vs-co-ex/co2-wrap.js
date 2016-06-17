var co = require(process.argv[2] || 'co');

var fn = co.wrap(function* (val) {
  return yield Promise.resolve(val);
});

fn(true).then(function (val) {
  console.log(val);
});
