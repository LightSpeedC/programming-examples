const fs = require('fs');
fs.readdirSync('.')
	.filter(x => fs.statSync(x).isDirectory())
	.forEach(x => console.log(x));
