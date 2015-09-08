var port = process.argv[2] || process.env.PORT || 3000;
console.log('port:', port);
var express = require('express'), app = express();
var http = require('http'), server = http.createServer(app).listen(port);
app.use(express.static('.'));
var io = require('socket.io')(server);
// app.get('/', function(req, res){
//	res.sendfile('index.html');
// });
var list = [{system: 'msg1'}, {system:'msg2'}];
io.on('connection', function(socket){
	//console.log('a user connected');
	socket.emit('all messages', list);
	socket.on('chat message', function(msg){
		//console.log('message: ' + msg);
		io.emit('chat message', msg);
		list.push(msg);
		if (list.length > 10)
			list.shift();
	});
	socket.on('disconnect', function(){
		//console.log('user disconnected');
	});
});
