void function () {
	'use strict';

	focus();

	const version = 'version: 0.0.5 (2016/06/13)';
	const path = require('path');
	const spawn = require('child_process').spawn;
	const aa = require('aa');
	const findDirFiles = require('./find-dir-files');
	const findController = {isCancel:false, cancel, progress};

	const debugFlag = m.prop(false);
	const releaseNotesFlag = m.prop(false);
	const includes = m.prop('');
	const excludes = m.prop('');
	const message = m.prop('検索できます');

	const targetDir = process.env.AAA_TARGET_DIR;
	const text = m.prop('');
	const newLayout = m.prop(true); // 新レイアウト
	let files = [targetDir + '\まだ検索していません'];
	let filesIsDirty = false;
	let wholeObject = {[findDirFiles.ERROR_PROP]: 'まだ検索していません'};
	let timer;
	const maxIndent = 20;
	const indentSpace = ' ';
	const HIDE_PROP = ' hide';

	m.mount($div, {view});

	// view
	function view() {
		return [
			m('h3', {key: 'title'}, 'ファイル検索 - ',
				m('font[color=green]', targetDir),
				(timer ? m('font[color=red]', ' - 検索中') : '')),
			m('div', {key: 'condition'},
				timer ? [
					m('div',
						m('button.button', {onclick: cancel}, 'ｷｬﾝｾﾙ'),
						m('b', m('font[color=red]', text()))),
					m('div', includes()),
					m('div', excludes())
				] : [
					m('form', {onsubmit: search},
						m('div',
							m('input', m_on('change', 'value', text,
								{autofocus: true, placeholder: '検索したい文字列', size: 100})),
							m('button.button[type=submit]', {onclick: search}, '検索'))),
					m('div',
						m('input', m_on('change', 'value', includes,
							{placeholder: '含む', size: 100})),
						'を含む'),
					m('div',
						m('input', m_on('change', 'value', excludes,
							{placeholder: '含まない', size: 100})),
						'を含まない')
				]
			),
			m('hr', {key: 'hr1'}),
			m('div', {key: 'message'}, message()), // メッセージ
			m('hr', {key: 'hr2'}),
			//m('div', {key: 'result'}, myViewResult()), // 検索結果
			//m('div', {key: 'result2'}, myViewResult2()), // 検索結果2
			m('div', {key: 'layout'},
				m('input[type=checkbox]',
					m_on('click', 'checked', newLayout)),
				'新レイアウト (作りたて注意)',
			m('hr', {key: 'hr3'}),
			(newLayout() ? myViewResult2() : myViewResult())), // 検索結果
			m('hr', {key: 'hr4'}),
			// デバッグ表示
			m('div', {key: 'release-notes'},
				m('input[type=checkbox]',
					m_on('click', 'checked', releaseNotesFlag)),
				'リリースノート: ' + version, (releaseNotesFlag() ? m('pre', {}, m('font[color=purple]', [
					'\t0.0.5 (2016/06/13): リリースノート表示、リファクタリング\n',
					'\t0.0.4 (2016/06/12): ツリー表示、新旧レイアウト切替\n',
					'\t0.0.3 (2016/06/11): 検索中のキャンセル\n',
					'\t0.0.2 (2016/06/10): フォルダやファイルへのリンク\n',
					'\t0.0.1 (2016/06/09): 検索したファイルの一覧表示、フィルタ(含む＋含まない)\n',
				])) : '')),
			// デバッグ表示
			m('div', {key: 'debug'},
				m('input[type=checkbox]',
					m_on('click', 'checked', debugFlag)),
				'デバッグ表示 (環境変数など)', (debugFlag() ? debugView() : ''))
		];
	}

	// 結果表示 単純リスト形式
	function myViewResult() {
		if (filesIsDirty) files = files.sort();
		filesIsDirty = false;
		const incl = includes();
		const excl = excludes();
		return m('table', {width: '100%', cellPadding: 0, border: 0, cellSpacing: 0},
			files
			.filter(file => file.includes(incl))
			.filter(file => !excl || !file.includes(excl))
			.map(file => {
				const dirs = file.split('\\');
				dirs.pop();
				const dir = dirs.join('\\');
				return m('tr', {key: file},
					m('td',
						{align: 'center', width: 50, style: {color: 'green'},
						 title: dir.substr(targetDir.length),
						 onclick: () => openExternal(dir)}, '[ﾌｫﾙﾀﾞ]'),
					m('td',
						{align: 'center', width: 44, style: {color: 'blue'},
						 title: file.substr(targetDir.length),
						 onclick: () => openExternal(file)}, '[ﾌｧｲﾙ]'),
					m('td',
						file.substr(targetDir.length))
				);
			})
		);
	}

	// range 0～n-1までの数字の配列
	function range(n) {
		var a = [];
		for (let i = 0; i < n; ++i) a.push(i);
		return a;
	}

	// ツリー表示
	function viewNode(nodePath, node, i, n, txt, incl, excl) {
		if (typeof node === 'object' && node !== null) {
			let keys = Object.getOwnPropertyNames(node);
			return [
				keys.filter(prop => prop !== HIDE_PROP).map(prop => {
					const child = node[prop];
					if (prop === findDirFiles.ERROR_PROP)
						return m('tr', {},
							range(i + 1).map(x => m('td.indent', indentSpace)),
							m('td.error', {colspan: n - i}, child + ''));
					const fullPath = nodePath.join('\\') + '\\' + prop;
					return [
						m('tr', {key: fullPath},
							(child || prop.includes(txt) &&
								(!incl || prop.includes(incl)) &&
								(!excl || !prop.includes(excl))) ? [
								range(i).map(x => m('td.indent', indentSpace)),
								m('td.indent', {},
									child ? m('input[type=checkbox]',
										m_on('click', 'checked',
											function (v) {
												if (arguments.length === 0) return child[HIDE_PROP] !== true;
												child[HIDE_PROP] = !v;
											}
										)
									) : indentSpace
								),
								m(child ? 'td.folder' : 'td.file', {
									colspan: n - i,
									title: fullPath.substring(targetDir.length + 1),
									onclick: () => openExternal(fullPath)
								}, prop)
							] : []
						),
						(!child || child[HIDE_PROP]) ? [] :
						viewNode(nodePath.concat(prop), child, i + 1, n, txt, incl, excl)
					];
				})
			];
		}
		else
			return [];
	}

	// 結果表示2 ツリー形式
	function myViewResult2() {
		const txt = text();
		const incl = includes();
		const excl = excludes();
		return m('table', {width: '100%', cellPadding: 0, border: 0, borderColor: 'lightgray', cellSpacing: 0},
			viewNode([], {[targetDir]: wholeObject}, 0, maxIndent, txt, incl, excl)
		);
	}

	// 検索コールバック
	function progress(object) {
		const file = object.file;
		wholeObject = object.wholeObject;
		if (file === targetDir) return;
		files.push(file);
		filesIsDirty = true;
	}

	// 検索
	function search() {
		message('検索中...');
		if (timer) return;
		aa(function *() {
			m.redraw(true);
			files = [];
			wholeObject = {};
			timer = setInterval(() => m.redraw(true), 500);
			findController.isCancel = false;
			try {
				yield findDirFiles(targetDir, text(),
					findController);
				if (!findController.isCancel)
					message('完了しました');
			} catch (e) {
				cancel();
				console.error('search err:');
				console.error(e);
				alert(e.stack);
			}
			finish();
		});
		return false;
	}

	// キャンセル
	function cancel() {
		if (!findController.isCancel)
			message('キャンセルしました');
		finish();
	}

	// 終了
	function finish() {
		findController.isCancel = true;
		if (timer) clearInterval(timer);
		timer = null; 
		m.redraw(true);
		setTimeout(() => m.redraw(true), 500);
	}

	// フォルダやファイルを開く
	function openExternal(file) {
		spawn('explorer', [file]);
		return;
	}

	// デバッグ表示
	function debugView() {
		return m('pre',
			m('font[color=brown]',
				('カレント作業ディレクトリ process.cwd(): ' + process.cwd()),
				('\n\nプロセスID process.pid: ' + process.pid),
				('\n\nバージョン process.versions: ' + JSON.stringify(process.versions, null, '\t')),
				('\n\n環境変数 process.env: ' + JSON.stringify(process.env, null, '\t'))
			));
	}

	// HTML要素のイベントと値にプロパティを接続するユーティリティ
	function m_on(eventName, propName, propFunc, attrs) {
		attrs = attrs || {};
		attrs['on' + eventName] = m.withAttr(propName, propFunc);
		attrs[propName] = propFunc();
		return attrs;
	}
}();
