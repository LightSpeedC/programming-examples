var port = process.argv[2] || process.env.PORT || 3000;
console.log('port:', port);
var express = require('express'), app = express();
var http = require('http'), server = http.createServer(app).listen(port);
var io = require('socket.io')(server);
app.use(express.static('.'));
// app.get('/', function(req, res){
//	res.sendfile('index.html');
// });

io.on('connection', function(socket){
	console.log('a user connected');
	socket.on('chat message', function(msg){
		console.log('message: ' + msg);
		io.emit('chat message', msg);
	});
	socket.on('disconnect', function(){
		console.log('user disconnected');
	});
});
