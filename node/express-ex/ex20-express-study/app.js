void function () {
	'use strict';

	const express = require('express'), app = express();

	// GET /
	app.get('/', (req, res) => res.send('Hello World!'));

	const books = ['book0', 'book1'];

	//======================================================
	// GET /books/
	app.get('/books/', (req, res) => res.json(books));

	// GET /books/:id
	app.get('/books/:id', (req, res) => res.json(books[req.params.id]));

	// POST /books
	app.post('/books/', (req, res) => {
		books.push(req.body);
		res.json(books.length);
	});

	// PUT /books/:id
	app.put('/books/:id', (req, res) => {
		books[req.params.id] = req.body;
		res.json(true);
	});

	// DELETE /books/:id
	app.delete('/books/:id', (req, res) => {
		delete books[req.params.id];
		res.json(true);
	});
	//======================================================

	const getRouterBooks = require('./router-books');
	app.use('/books2', getRouterBooks(books)); 

	// サーバーを起動する部分
	const server = app.listen(3000, function () {
		console.log(server.address());
		const host = server.address().address;
		const port = server.address().port;
		console.log('Example app listening at http://%s:%s',
			host == '::' ? 'localhost' : host, port);
	});

}();
