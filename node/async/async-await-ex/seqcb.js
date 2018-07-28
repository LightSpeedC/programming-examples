// seqcb

function seqcb(args, cb) {
	nextTick(() => {
		var result = [];
		var n = args.length;
		if (n <= 0) return cb(null, []);
		args[0]((err, val) => chk(val, 0));
		function chk(x, i) {
			result[i] = x;
			if (++i < n) next(args[i], (err, val) => chk(val, i));
			else cb(null, result);
		}
	});
}

function parcb(args, cb) {
	nextTick(() => {
		var result = [];
		var n = args.length;
		if (n <= 0) return cb(null, []);
		args.forEach((arg, i) => arg((err, val) => chk(val, i)));
		function chk(x, i) {
			result[i] = x;
			--n || cb(null, result);
		}
	});
}

var test = val => cb => cb(null, val);
var wait = sec => cb => setTimeout(cb, sec * 1000);
var xxxx = sec => cb => setTimeout(cb, sec * 1000, new Error('always error'));
var slice = [].slice;
var nextTick = typeof process === 'object' && process && process.nextTick || setImmediate;
var next$i = 0;
var next = (cb, err, val) =>
	++next$i > 50 ? (next$i = 0, nextTick(cb, err, val)) : cb(err, val);

parcb([], (err, val) => console.log('final1:', err, val));
parcb([test(1), test(2)], (err, val) => console.log('final:', err, val));
console.log('111');
