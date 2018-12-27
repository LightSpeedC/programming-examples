'use strict';

const http = require('http');

// =====================================================================================
// HTTPリクエスト・レスポンス
http.createServer(async (req, res) => {
	try {
		await route(req, res);
		// send(res, {result: true});
	} catch (err) {
		console.error(getNow(), err);
		send(res, {error: {
			code: err.code || err + '',
			message: err.message,
			data: undefined}});
	}
})
.setTimeout(0)
.listen(port, () => console.log('listen'));

// =====================================================================================
// 現在時刻を取得
function getNow() {
	const dt = new Date();
	return dt.toLocaleDateString() + ' ' +
		dt.toLocaleTimeString() + '.' +
		('00' + dt.getMilliseconds()).substr(-3);
}

// =====================================================================================
// チャネル
function Channel() {
	const vals = [], cbs = [];
	chan.then = (res, rej) => chan((err, val) => err ?
			rej ? rej(err) : err : res ? res(val) : val);
	return chan;

	function chan(cb) {
		// Thunk
		if (typeof cb === 'function') cbs.push(cb);
		// Promise
		else if (cb && typeof cb.then === 'function')
			try { cb.then(chan, chan); }
			catch (err) { vals.unshift([err, undefined]); }
		// Other
		else {
			const args = [].slice.call(arguments);
			if (args.length === 1 && !(cb == null || cb instanceof Error)) args = [null, cb];
			vals.push(args.length > 2 ? [args.shift(), args] : args);
		}

		// Callback(Arguments) / Callback(error, result)
		while (cbs.length > 0 && vals.length > 0)
			try { cbs.shift().apply(undefined, vals.shift()); }
			catch (err) { vals.unshift([err, undefined]); }

		return chan;
	}
}

// =====================================================================================
// resに送信する (JSON, Buffer, String)
function send(res, data) {
	res.writeHead(200, {'Content-Type': 'text/html; charset=UTF-8'});
	if (typeof data === 'string' || data instanceof Buffer) res.end(data);
	else res.end(JSON.stringify(data));
}

// =====================================================================================
// req毎に持つウィークマップ
const cache = new WeakMap();

// =====================================================================================
// バッファ取得
async function getBuff(req) {
	const data = cache.get(req) || cache.set(req, {}).get(req);
	if (data.buf) return data.buf;

	const chan = Channel(), list = [];
	req.on('data', data => list.push(data))
		.on('error', chan).on('end', chan);
	await chan;
	return data.buf = Buffer.concat(list);
}

// =====================================================================================
// JSONを取得
async function getJson(req) {
	const buf = await getBuff(req);
	if (buf.length === 0) return null;
	return JSON.parse(buf.toString());
}

// =====================================================================================
// ルート
async function route(req, res) {
	const json = await getJson(req);
	send(res, {result: json});
}