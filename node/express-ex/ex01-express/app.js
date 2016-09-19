const express = require('express');
const app = express();
const debug = require('debug')('ex01-express:server');

// respond with "Hello World!" on the homepage
// respond with "Hello World!" when a GET request is made to the homepage
app.get('/', function (req, res) {
	res.send('Hello World!');
});

// accept POST request on the homepage
app.post('/', function (req, res) {
	res.send('Got a POST request');
});

// accept PUT request at /user
app.put('/user', function (req, res) {
	res.send('Got a PUT request at /user');
});

// accept DELETE request at /user
app.delete('/user', function (req, res) {
	res.send('Got a DELETE request at /user');
});

app.all('/secret', function (req, res, next) {
	debug('Accessing the secret section ...');
	next();	// pass control to the next handler
});

// public files
app.use(express.static('public'));
//app.use('/public', express.static('public'));

// handle error
app.use(function(req, res, next){
	res.status(404).send('Sorry cant find that!');
	//res.send(404, 'Sorry cant find that!');
});

// handle error
//app.use(function(err, req, res, next){
//	console.error(err.stack);
//	res.send(500, 'Something broke!');
//});

const server = app.listen(3000, function () {
	let host = server.address().address;
	const port = server.address().port;

	if (host === '::') host = 'localhost';

	debug('Example app listening at http://%s:%s', host, port);
});
