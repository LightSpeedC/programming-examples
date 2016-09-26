void function () {
	'use strict';

	module.exports = function (context) {

		const router = require('express').Router();

		/* GET users listing. */
		router.get('/', function routeUsersGet(req, res, next) {
			res.send('respond with a resource');
		});

		return function routeUsers() { return router.apply(this, arguments) };

	};

} ();
