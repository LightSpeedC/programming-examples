fs = require('fs')
fs.readdirSync('.').filter(x => x.startsWith('ex10'))
.forEach(x => fs.renameSync(x, x.replace(/ex10-/, '')))
