void function () {
	'use strict';

	const router = require('express').Router();

	function getRouter(books) {

		// GET /
		router.get('/', (req, res) => res.json(books));

		// GET /:id
		router.get('/:id', (req, res) => res.json(books[req.params.id]));

		// POST 
		router.post('/', (req, res) => {
			books.push(req.body);
			res.json(books.length);
		});

		// PUT /:id
		router.put('/:id', (req, res) => {
			books[req.params.id] = req.body;
			res.json(true);
		});

		// DELETE /:id
		router.delete('/:id', (req, res) => {
			delete books[req.params.id];
			res.json(true);
		});

		return router;
	}

	module.exports = getRouter;

} ();
