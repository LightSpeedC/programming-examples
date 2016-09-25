'use strict';

const http = require('http');
const path = require('path');
const fs = require('fs');

const mimes = {
	'.html': 'text/html',
	'.js': 'text/javascript'
};
const dir = __dirname;

http.createServer(function onRequest(req, res) {
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

	fs.stat(file, (err, stat) => { // ファイルの状態?
		if (err) return resError(404, err); // エラー

		if (stat.isDirectory()) { // ディレクトリの場合
			// URLが'/'で終わっていない時はリダイレクトさせる
			if (!req.url.endsWith('/'))
				return resRedirect(301, req.url + '/');

			// index.htmlがあるか?
			const file2 = path.join(file, 'index.html');
			fs.stat(file2, (err, stat) => {
				if (err) resDir(file); // 無ければディレクトリ一覧
				else resFile(file2); // あればファイルを応答
			});
		}
		else resFile(file); // ファイルの場合ファイルを応答
	});

	function resFile(file) { // ファイルを応答
		res.writeHead(200, {'content-type':
			mimes[path.extname(file)] || 'text/plain'});
		fs.createReadStream(file).on('error', resError).pipe(res);
	}

	function resDir(dir) { // ディレクトリ一覧
		fs.readdir(dir, (err, names) => {
			if (err) return resError(500, err);

			res.writeHead(200, {'content-type': 'text/html'});
			res.end('<pre>' + names.map(x =>
					'<a href="' + x + '">' + x + '</a>')
					.join('\n') + '</pre>');
		});
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

}).listen(process.env.PORT || 3000); // ポートをListenする
