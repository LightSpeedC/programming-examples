var port = process.argv[2] || process.env.PORT || 3000;
console.log('port:', port);
var express = require('express'), app = express();
app.use(express.static('.')).listen(port);
