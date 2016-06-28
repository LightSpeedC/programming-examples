os = require('os')
util = require('util')
Object.keys(os).filter(x => x !== 'getNetworkInterfaces')
	.map(x => console.log('■' + x + (typeof os[x] ==='function' ? '()' : '') + ':',
	util.inspect(typeof os[x] ==='function' ?
		os[x]() : os[x],
		{colors:true, depth:null})))
