var io = require('socket.io')(3000);
var cfg = require('./local-cfg.json');
var tw = require('node-tweet-stream')(cfg);
tw.track('socket.io');
tw.track('javascript');
tw.on('tweet', function(tweet){
	console.log(tweet);
	io.emit('tweet', tweet);
});
