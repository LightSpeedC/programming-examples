const fs = require('fs');
const http = require('http');
const PORT = Number(process.argv[2] || process.env.PORT || 3000);

const server = http.createServer((req, res) => {
	if (req.url === '/')
		return res.writeHead(200, {'content-type': 'text/html; charset=UTF-8'}),
			fs.createReadStream('./index.html').pipe(res);

	res.writeHead(200, {'content-type': 'text/html; charset=UTF-8'});
	res.end('<h1>Hello world [' + req.url + ']</h1>');
});

const io = require('socket.io')(server);

const sessions = new Map();
let sessionNo = 0;

class Session {
	constructor(socket) {
		// セッションID取得
		let sessionId = Date.now();
		while (sessions.has(sessionId))
			++sessionId;

		this._sessionId = sessionId;
		this._sessionNo = ++sessionNo;
		this._socket = socket;

		sessions.set(sessionId, this);
	}
	get sessionId() { return this._sessionId; }
	get sessionNo() { return this._sessionNo; }
	get socket() { return this._socket; }
	destroy() {
		sessions.delete(this._sessionId);
	};
}

function getNumbers() {
	const list = [];
	for (let [key, val] of sessions) {
		//console.log(key, val);
		list.push(val.sessionNo);
	}
	return list;
}

// 接続時
io.on('connection', function (socket) {
	const session = new Session(socket);
	const {sessionId, sessionNo} = session;
	const sessionNm = 'No ' + sessionNo + ' (' + sessionId + ')';

	socket.emit('session id', {sessionId, sessionNo});

	const msg = sessionNm + 'が入室しました。' +
			'(現在' + sessions.size + '人: ' +
			getNumbers().join(', ') + ')';
	io.emit('chat message', msg);
	console.log(sessionNm + ': a user connected ' + msg);

	// 全員にブロードキャスト
	//io.emit('some event', { for: 'everyone' });

	// 自分以外の全員にブロードキャスト
	//socket.broadcast.emit('hi', 'hi there');

	// メッセージ受信時
	socket.on('chat message', function (msg) {
		console.log(sessionNm + ': message: ' + msg);
		io.emit('chat message', msg);
	});

	// 切断時
	socket.on('disconnect', function () {
		session.destroy();
		const msg = sessionNm + 'が退室しました。' +
			'(現在' + sessions.size + '人: ' +
			getNumbers().join(', ') + ')';
		console.log(sessionNm + ': user disconnected: ' + msg);
		socket.broadcast.emit('chat message', msg);
	});
});

// サーバー・リッスン
server.listen(PORT, function() {
	console.log('サーバーを起動しました。port: ' + PORT);
});

// サーバー・エラー
server.on('error', err => {
	if (err.code === 'EADDRINUSE')
		console.log('既に起動されています。port: ' + PORT);
	else
		console.error(err);
	process.exit();
});
