var Twitter = require('node-tweet-stream');
/*
var t = new Twitter({
	consumer_key: '',
	consumer_secret: '',
	token: '',
	token_secret: ''
});
*/
var t = new Twitter(require('./local-cfg.json'));

t.on('tweet', function (tweet) {
	console.log('tweet received', tweet)
});

t.on('error', function (err) {
	console.log('Oh no')
});

t.track('nodejs');
t.track('pizza');

// 5 minutes later
t.track('tacos');

// 10 minutes later
t.untrack('pizza');
