Number.prototype.times = function (f) { for (var i = 0, n = Number(this); i < n; ++i) f(i); };

10..times(i => console.log(i + 1));

Number.prototype.downto = function (f) { for (var i = Number(this); i > 0; --i) f(i); };

10..downto(i => console.log(i));

Number.prototype.upto = function (n, f) { for (var i = Number(this); i <= n; ++i) f(i); };

1..upto(10, i => console.log(i));
