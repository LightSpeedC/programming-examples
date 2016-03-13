(function () {
	'use strict';
	var port = process.argv[2] || process.env.PORT || 3000;
	console.log('port:', port);
	// var express = require('express'), app = express();
	// app.use(express.static('.')).listen(port);

	var fs = require('fs');
	var http = require('http');
	var app = http.createServer(function(req, res) {
		res.writeHead(200, {'Content-Type': 'text/html'});
		fs.createReadStream('index.html').pipe(res)
	});

	var io = require('socket.io')(app);
	app.listen(port);

	function Item(attrs) {
		if (!(this instanceof Item)) return new Item(attrs);
		this.key = attrs && attrs.key || new Date - 0;
		this.msg = attrs && attrs.msg || '';
	}

	var msgsFile = './msgs.log';
	function ItemList(list) {
		this.list = (list || []).map(Item);
	}
	ItemList.prototype.load = function () {
		try {
			this.list = JSON.parse(fs.readFileSync(msgsFile).toString()).map(Item);
		} catch (e) { console.log(e + ''); }
	};
	ItemList.prototype.save = function () {
		fs.writeFile(msgsFile, JSON.stringify(this.list, null, '  '));
	};
	ItemList.prototype.toJSON = function () { return this.list; };
	ItemList.prototype.map = function () { return [].map.apply(this.list, arguments); };
	ItemList.prototype.push = function () { return [].push.apply(this.list, arguments); };
	ItemList.prototype.shift = function () { return [].shift.apply(this.list, arguments); };
	Object.defineProperty(ItemList.prototype, 'length',
		{get: function () { return this.list.length; }});

	var numClients = 0;
	var itemList = new ItemList();
	itemList.load();
	itemList.map(function (item) { console.log(item.constructor.name, new Date(item.key), item.msg); });
	addMessage('server up: ' + new Date);

	function addMessage(message) {
		var item = new Item({msg: message});
		addItem(item);
		return item;
	}

	function addItem(item) {
		itemList.push(item);
		if (itemList.length > 20) itemList.shift();
		itemList.save();
	}

	setInterval(function () {
		io.emit('heartbeat');
	}, 3000);

	io.on('connection', function(socket) {
		++numClients;
		io.emit('num-to-client', numClients);
		socket.on('disconnect', function () {
			--numClients;
			io.emit('num-to-client', numClients);
		});
		socket.on('req-all-msg-to-server', function() {
			socket.emit('all-msg-to-client', itemList);
		});
		socket.on('msg-to-server', function(message) {
			io.emit('msg-to-client', addMessage(message));
		});
	});
})();
