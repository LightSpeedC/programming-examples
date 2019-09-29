const http = require('http');
const sockjs = require('sockjs');

const echo = sockjs.createServer({ sockjs_url: 'http://cdn.jsdelivr.net/sockjs/1.0.1/sockjs.min.js' });
echo.on('connection', function(conn) {
	console.log('connection:');
	conn.on('data', function(message) {
		console.log('data:', message);
		conn.write(message);
	});
	conn.on('close', function() {
		console.log('close:');
	});
});

const server = http.createServer();
echo.installHandlers(server, {prefix:'/echo'});
server.listen(9050);
