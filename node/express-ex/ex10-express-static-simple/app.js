void function () {
	'use strict';
	const express = require('express'), app = express();

	app.use(express.static('public'));

	app.listen(process.argv[2] || process.env.PORT || 3000);
} ();
