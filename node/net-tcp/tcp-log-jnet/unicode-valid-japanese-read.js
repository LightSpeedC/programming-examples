	fs = require('fs')
	util = require('util')
	u = fs.readFileSync('unicode-valid-japanese.txt').toString().split('\n').map(p => p.split(' ').map(c => parseInt(c, 16)))
	console.log(util.inspect(u[1]))
	uu = {}
	u.forEach(p => { for (var i = p[0]; i <= p[1]; ++i) uu[i] = true; })
	console.log(JSON.stringify(uu))
