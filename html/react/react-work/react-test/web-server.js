require('express')().use(require('express').static('.')).use(require('serve-index')('.', {icons: true})).listen(process.env.PORT || 3000);
