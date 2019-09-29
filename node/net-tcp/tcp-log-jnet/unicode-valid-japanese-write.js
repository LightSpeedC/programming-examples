	fs = require('fs')
	util = require('util')
	u = fs.readFileSync('u.txt').toString().split('\n').map(c => parseInt(c.substr(4,4), 16))
	mi = b = u[0]
	for (var i = 1, n = u.length; i < n; ++i) {
		a = u[i]
		if (b + 1 !== a) {
			console.log(mi.toString(16), b.toString(16))
			mi = a
		}
		b = a
	}
