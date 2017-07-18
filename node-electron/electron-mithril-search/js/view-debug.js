'use strict';

module.exports = function (m, dir, file) {

	return viewDebug;

	// デバッグ表示
	function viewDebug() {
		const list = [
			'カレント作業ディレクトリ process.cwd(): ' + process.cwd(),
			'ディレクトリ名 __dirname: ' + dir,
			'ファイル名 __filename: ' + file,
			'プロセスID process.pid: ' + process.pid,
			'バージョン process.versions: ' + JSON.stringify(process.versions, null, '\t'),
			'環境変数 process.env: ' + JSON.stringify(process.env, null, '\t'),
		];
		return m('ul', list.map(x => m('li', m('pre', x))));
	}

};
