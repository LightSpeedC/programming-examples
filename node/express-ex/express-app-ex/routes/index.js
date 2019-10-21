void function () {
	'use strict';

	module.exports = function (context) {

		const router = require('express').Router();

		/* GET home page. */
		router.get('/', function routeIndexGet(req, res, next) {
			res.render('index', {title: 'Express'});
		});

		return function routeIndex() { return router.apply(this, arguments) };

	};

} ();
