var Channel = require('./chan2');
Channel(function () {
	setTimeout(this, 500, 'a2');
}, function (err, val) {
	console.log('a2? ' + val);
	setTimeout(this, 500, 'b2');
}, function (err, val) {
	console.log('b2? ' + val);
	setTimeout(this, 500, 'c2');
}, function (err, val) {
	console.log('c2? ' + val);
	var next = this;
	setTimeout(function () {
		next('d2');
	}, 500);
}, function (err, val) {
	console.log('d2? ' + val);
	var next = this, arr = [], chan2 = Channel(
		function (err, val) { console.log('e2 1st? ' + val); arr.push(val); },
		function (err, val) { console.log('e2 2nd? ' + val); arr.push(val); next(arr); });
	setTimeout(chan2, 300, 'e2X');
	setTimeout(chan2, 200, 'e2Y');
}, function (err, arr) {
	console.log('e2 arr: ' + arr.join(', '));
	this('f21', 'f22', 'f23');
}, function (err, val) {
	console.log('f2 values: ' + val.join(', '));
	this(new Promise(function (res, rej) {
		setTimeout(res, 500, 'g2');
	}));
}, function (err, val) {
	console.log('g2? ' + val);
	this(function (err, val) { console.log('xx1', err, val); });
	this('val1');
	this(function (err, val) { console.log('xx2', err, val); },
		function (err, val) { console.log('xx3', err, val); });
	this('val2');
	this('val3');
	console.log('end');
})();
