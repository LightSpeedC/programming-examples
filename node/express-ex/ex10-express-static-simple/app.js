require('express')().use(require('express').static('.')).listen(process.argv[2] || process.env.PORT || 3000);
