var x = [];
var n = 1e6;
for (var j = 0; j < 5; ++j) {
  var y = [Date.now()];
  for (var i = 0; i < n; ++i)
    var t = Date.now();

  y.push(Date.now());
  for (var i = 0; i < n; ++i)
    var t = new Date().getTime();

  y.push(Date.now());
  for (var i = 0; i < n; ++i)
    var t = Date.now();

  y.push(Date.now());
  for (var i = 0; i < n; ++i)
    var t = new Date().getTime();

  y.push(Date.now());
  for (var i = 1; i < y.length; ++i)
    y[i - 1] = y[i] - y[i - 1];
  y.pop();
  x.push(y);
}

console.log(x);
