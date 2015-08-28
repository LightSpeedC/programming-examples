var port = process.argv[2] || process.env.PORT || 3000;
console.log('port:', port);
//var express = require('express'), app = express();
//app.use(express.static('.')).listen(port);

var fs = require('fs');
var http = require('http');
var app = http.createServer(function(req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  fs.createReadStream('index.html').pipe(res)
});
var io = require('socket.io')(app);
app.listen(port);
io.on('connection', function(socket) {
  socket.on('msg', function(data) {
    io.emit('msg', data);
  });
});
