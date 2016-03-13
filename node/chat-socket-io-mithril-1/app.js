(function () {
	'use strict';
	var port = process.argv[2] || process.env.PORT || 3000;
	console.log('port:', port);

	var fs = require('fs');
	var http = require('http');
	var app = http.createServer(function(req, res) {
		res.writeHead(200, {'Content-Type': 'text/html'});
		fs.createReadStream('index.html').pipe(res)
	});

	var io = require('socket.io')(app);
	app.listen(port);

	var msgsFile = './msgs.log';
	function loadMsgs() {
		try {
			msgs = JSON.parse(fs.readFileSync(msgsFile).toString());
		} catch (e) { console.log(e + ''); }
	}
	function saveMsgs() {
		fs.writeFile(msgsFile, JSON.stringify(msgs, null, '\t'));
	}

	var msgs = [];
	loadMsgs();
	addText('server up: ' + new Date);

	function addText(text) {
		return addMsg({key: new Date - 0, text: text});
	}

	function addMsg(msg) {
		msgs.push(msg);
		if (msgs.length > 20) msgs.shift();
		saveMsgs();
		return msg;
	}

	io.on('connection', function(socket) {
		socket.on('all', function() {
			socket.emit('all', msgs);
		});
		socket.on('msg', function(text) {
			io.emit('msg', addText(text));
		});
	});
})();
