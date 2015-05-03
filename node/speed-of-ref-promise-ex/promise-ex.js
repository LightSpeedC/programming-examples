console.log('this.Promise: ', this.Promise);
console.log('Promise: ', typeof Promise === 'function' ? Promise : undefined);
console.log('global.Promise: ', Function('return this')().Promise);

var n = 1e7;
var z = [];
for (var j = 0; j < 5; ++j) {
  var g = Function('return this')();
  var y = [Date.now()];

  for (var i = 0; i < n; ++i)
    var p = this.Promise;
  y.push(Date.now());

  for (var i = 0; i < n; ++i)
    var p = typeof Promise === 'function' ? Promise : undefined;
  y.push(Date.now());

  for (var i = 0; i < n; ++i)
    var p = g.Promise;
  y.push(Date.now());

  for (var i = 0; i < n; ++i)
    var p = this.Promise;
  y.push(Date.now());

  for (var i = 0; i < n; ++i)
    var p = typeof Promise === 'function' ? Promise : undefined;
  y.push(Date.now());

  for (var i = 0; i < n; ++i)
    var p = g.Promise;
  y.push(Date.now());

  for (var i = 1; i < y.length; ++i)
    y[i - 1] = y[i] - y[i - 1];
  y.pop();
  z.push(y);
}
console.log(z);
