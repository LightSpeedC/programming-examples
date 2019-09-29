'use strict';

const http = require('http');
const path = require('path');
const fs = require('fs');
const aa = require('aa');

const mimes = {
	'.html': 'text/html',
	'.js': 'text/javascript'
};
const dir = __dirname;

aa.thunkifyAll(fs);

http.createServer(aa.callback(function *onRequest(req, res) {
	const start = process.hrtime(); // 開始時刻
	res.end = (end => function () { // 終了時にログ出力
		const delta = process.hrtime(start); // 時刻の差
		console.log(res.statusCode + '', req.method, req.url,
			(delta[0] * 1e3 + delta[1] / 1e6).toFixed(3), 'msec');
		end.apply(this, arguments);
	}) (res.end);

	const file = path.join(dir, req.url); // 実際のファイル名
	if (!file.startsWith(dir)) // 悪意のある要求は除外
		return resError(418, new Error('malicious? ' + file));

	try {
		const stat = yield fs.statAsync(file); // ファイルの状態?

		if (stat.isDirectory()) { // ディレクトリの場合
			// URLが'/'で終わっていない時はリダイレクトさせる
			if (!req.url.endsWith('/'))
				return resRedirect(301, req.url + '/');

			// index.htmlがあるか?
			const file2 = path.join(file, 'index.html');
			try {
				yield fs.statAsync(file2);
				resFile(file2); // あればファイルを応答
			} catch (err) {
				yield resDir(file); // 無ければディレクトリ一覧
			}
		}
		else resFile(file); // ファイルの場合ファイルを応答
	} catch (err) {
		return resError(404, err); // エラー
	}

	function resFile(file) { // ファイルを応答
		res.writeHead(200, {'content-type':
			mimes[path.extname(file)] || 'text/plain'});
		fs.createReadStream(file).on('error', resError).pipe(res);
	}

	function *resDir(dir) { // ディレクトリ一覧
		try {
			const names = yield fs.readdirAsync(dir);

			res.writeHead(200, {'content-type': 'text/html'});
			res.end('<pre>' + names.map(x =>
					'<a href="' + x + '">' + x + '</a>')
					.join('\n') + '</pre>');
		} catch (err) {
			resError(500, err);
		}
	}

	function resRedirect(code, loc) { // リダイレクトさせる
		res.writeHead(code, {location: loc});
		res.end(code + ' ' + http.STATUS_CODES[code] + '\n' + loc);
	}

	function resError(code, err) { // エラー応答
		if (code instanceof Error) err = code, code = 500;
		res.writeHead(code, {'content-type': 'text/plain'});
		res.end(code + ' ' + http.STATUS_CODES[code] + '\n' +
			(err + '').replace(dir, '*'));
	}

})).listen(process.env.PORT || 3000); // ポートをListenする
