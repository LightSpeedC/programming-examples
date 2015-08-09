var express = require('express'), app = express();
app.use(express.static('.')).listen(8002);
