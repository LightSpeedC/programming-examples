var express = require('express'), app = express();
app.use(express.static('.')).listen(process.argv[2] || process.env.PORT || 3000);
