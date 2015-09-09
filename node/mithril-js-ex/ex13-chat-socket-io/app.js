var port = process.argv[2] || process.env.PORT || 3000;
console.log('port:', port);
var express = require('express'), app = express();
var http = require('http'), server = http.createServer(app).listen(port);
var path = require('path');
var users = {};
var maxAge = 30 * 60; // 30 min
app.get('/', function(req, res){
	var c = getCookies(req.headers['cookie']);
	//console.log(c);
	c.user = c.user || (+ new Date + Math.random()).toFixed(3);
	users[c.user] = c.name = c.name || users[c.user] || c.user;
	res.setHeader('set-cookie',
		['user=' + c.user + '; max-age=' + maxAge,
		 'name=' + c.name + '; max-age=' + maxAge]);
	res.sendFile(path.resolve('.', 'index.html'));
});
app.use(express.static('.'));
var io = require('socket.io')(server);
var list = [{user: 'system', msg: 'server up at ' + new Date}];
function msgMap(msg) {
	return {user: users[msg.user] || msg.user, msg: msg.msg};
}
io.on('connection', function(socket){
	//console.log('a user connected');
	socket.emit('all messages', list.map(msgMap));

	socket.on('user', function(data) {
		console.log('user:', data);
		users[data.user] = data.name || users[data.user] || data.user;
	});

	socket.on('chat message', function(msg) {
		console.log('message(' + users[msg.user] + '): ' + JSON.stringify(msg));
		io.emit('chat message', msgMap(msg));
		list.push(msg);
		if (list.length > 10)
			list.shift();
	});
	socket.on('disconnect', function(){
		//console.log('user disconnected');
	});
});

function getCookies(c) {
	var cookies = {};
	if (c) c.split(/; */).forEach(function (c) {
		var kv = c.split('=');
		cookies[kv[0]] = kv[1];
	});
	return cookies;
}
