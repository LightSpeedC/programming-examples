void function () {
	'use strict';

	focus();

	const version = 'version: 0.0.6 (2016/06/13)';
	const path = require('path');
	const spawn = require('child_process').spawn;
	const electron = require('electron');
	const aa = require('aa');
	const findDirFiles = require('./find-dir-files');
	const findController = {isCancel:false, cancel, progress};
	const CLEAN_PROP = findDirFiles.CLEAN_PROP;
	const ERROR_PROP = findDirFiles.ERROR_PROP;

	const debugFlag = m.prop(false);
	const usageFlag = m.prop(false);
	const releaseNotesFlag = m.prop(false);
	const wishListFlag = m.prop(false);
	const includes = m.prop('');
	const excludes = m.prop('');
	const message = m.prop('検索できます');

	const targetDir = process.env.AAA_TARGET_DIR;
	const text = m.prop('');
	const newLayout = m.prop(true); // 新レイアウト
	let files = [targetDir + '\まだ検索していません'];
	let filesIsDirty = false;
	let wholeObject = {[ERROR_PROP]: 'まだ検索していません'};
	let timer; // 検索中のインターバルタイマー
	const maxIndent = 20; // 最大インデントの深さ
	const indentSpace = ' ';
	const INVISIBLE_PROP = ' ';
	const HIDE_PROP = ' hide';
	const SUBTREE_RETAIN = {subtree: 'retain'};

	m.mount($div, {view});

	// 使い方表示
	function usageView() {
		const list = [
			'ファイル名の一部として「検索したい文字列」を入れて「検索」します (Enterで検索)',
			'ファイル名に「含む」文字列をフィルタします (Enterで更新)',
			'ファイル名に「含まない」文字列を除外します (Enterで更新)',
			'検索中に「キャンセル」できます',
			'フォルダやファイルへリンクできます (ファイルの左の■でフォルダへリンク)',
			'ツリー表示でき、チェックボックスで非表示にできます (再検索でリセット)',
			'新旧のレイアウトを切替できます → 後で削除する予定',
			'×ワイルドカード検索はまだできません',
			'×あまりたくさんのファイルを検索するとハングする可能性があります',
		];
		return m('font[color=gray]', {}, m('ul', list.map(x => m('li', x))));
	}

	// リリース・ノート表示
	function releaseNotesView() {
		const list = [
			'0.0.6 (2016/06/14): ルート・フォルダのリンク不具合修正、ほか',
			'0.0.5 (2016/06/13): リリース・ノート表示、リファクタリング',
			'0.0.4 (2016/06/12): ツリー表示、新旧レイアウト切替',
			'0.0.3 (2016/06/11): 検索中のキャンセル',
			'0.0.2 (2016/06/10): フォルダやファイルへのリンク、フィルタ(含む＋含まない)',
			'0.0.1 (2016/06/09): 検索したファイルの一覧表示',
		];
		return m('font[color=darkblue]', {}, m('ul', list.map(x => m('li', x))));
	}

	// やりたいことリスト表示
	function wishListView() {
		const list = [
			'AND/OR検索',
			'ワイルドカード検索',
			'ファイル数制限'
		];
		return m('font[color=purple]', {}, m('ul', list.map(x => m('li', x))));
	}

	// メインview
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

			// メッセージ
			m('div', {key: 'message'}, m('b', message())),
			m('hr', {key: 'hr2'}),

			m('div', {key: 'layout'},
				m('input[type=checkbox]',
					m_on('click', 'checked', newLayout)),
				'新レイアウト (作りたて注意)',
			m('hr', {key: 'hr3'}),
			(newLayout() ? myViewResult2() : myViewResult())), // 検索結果
			m('hr', {key: 'hr4'}),

			// 使い方表示
			m('div', {key: 'usage'},
				m('input[type=checkbox]',
					m_on('click', 'checked', usageFlag)),
				'使い方', usageFlag() ? usageView() : ''),

			// リリース・ノート表示
			m('div', {key: 'release-notes'},
				m('input[type=checkbox]',
					m_on('click', 'checked', releaseNotesFlag)),
				'リリース・ノート: ' + version, releaseNotesFlag() ? releaseNotesView() : ''),

			// やりたいことリスト表示
			m('div', {key: 'wish-list'},
				m('input[type=checkbox]',
					m_on('click', 'checked', wishListFlag)),
				'やりたいことリスト', wishListFlag() ? wishListView() : ''),

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
						 onclick: () => openItem(dir)}, '[ﾌｫﾙﾀﾞ]'),
					m('td',
						{align: 'center', width: 44, style: {color: 'blue'},
						 title: file.substr(targetDir.length),
						 onclick: () => openItem(file)}, '[ﾌｧｲﾙ]'),
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
				keys.filter(prop => !prop.startsWith(INVISIBLE_PROP)).map(prop => {
					const child = node[prop];
					const fullPath = (nodePath.join('\\') + '\\' + prop).substr(i === 0);
					if (prop === ERROR_PROP)
						return child === undefined ? [] :
							m('tr', {key: fullPath},
								range(i + 1).map(x => m('td.indent', indentSpace)),
								m('td.error', {colspan: n - i}, child + ''));
					let vdom = [];
					if (child || prop.includes(txt) &&
							(!incl || prop.includes(incl)) &&
							(!excl || !prop.includes(excl))) {
						//if (!node[CLEAN_PROP]) {
							vdom.push(m('tr', {key: fullPath}, [
								range(i).map(x => m('td.indent', indentSpace)),
								child ?
								m('td.indent', {}, m('input[type=checkbox]',
									m_on('click', 'checked', v =>
										v === undefined ? !child[HIDE_PROP] :
										(child[HIDE_PROP] = !v))
								)) :
								m('td.indent.folder',
									{onclick: () => showItemInFolder(fullPath)},
									'■'),
								m(child ? 'td.folder' : 'td.file', {
									colspan: n - i,
									title: fullPath.substring(targetDir.length + 1),
									onclick: () => openItem(fullPath)
								}, prop)
							]));
						//	node[CLEAN_PROP] = true;
						//}
						//else {
						//	vdom.push(m('tr', {key: fullPath},
						//		range(n + 1).map(x => SUBTREE_RETAIN)));
						//}
					}
					if (child && !child[HIDE_PROP])
						vdom.push(viewNode(nodePath.concat(prop), child, i + 1, n, txt, incl, excl));
					return vdom;
/*
					return [
						(child || prop.includes(txt) &&
							(!incl || prop.includes(incl)) &&
							(!excl || !prop.includes(excl))) ?
						m('tr', {key: fullPath}, [
							range(i).map(x => m('td.indent', indentSpace)),
							child ?
							m('td.indent', {}, m('input[type=checkbox]',
								m_on('click', 'checked', v =>
									v === undefined ? !child[HIDE_PROP] :
									(child[HIDE_PROP] = !v))
							)) :
							m('td.indent.folder',
								{onclick: () => showItemInFolder(fullPath)},
								'■'),
							m(child ? 'td.folder' : 'td.file', {
								colspan: n - i,
								title: fullPath.substring(targetDir.length + 1),
								onclick: () => openItem(fullPath)
							}, prop)
						]) : '',
						!child || child[HIDE_PROP] ? [] :
						viewNode(nodePath.concat(prop), child, i + 1, n, txt, incl, excl)
					];
*/
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
	function openItem(file) {
		spawn('explorer', [file]);
		//electron.shell.openItem(file);
		//alert('openItem ?\n' + file);
		return;
	}

	// ファイルのあるフォルダを開く
	function showItemInFolder(file) {
		electron.shell.showItemInFolder(file);
		//alert('showItemInFolder ?\n' + file);
		return;
	}

	// デバッグ表示
	function debugView() {
		const list = [
			'カレント作業ディレクトリ process.cwd(): ' + process.cwd(),
			'プロセスID process.pid: ' + process.pid,
			'バージョン process.versions: ' + JSON.stringify(process.versions, null, '\t'),
			'環境変数 process.env: ' + JSON.stringify(process.env, null, '\t'),
		];
		return m('font[color=brown]',{}, m('ul', list.map(x => m('li', m('pre', x)))));
	}

	// HTML要素のイベントと値にプロパティを接続するユーティリティ
	function m_on(eventName, propName, propFunc, attrs) {
		attrs = attrs || {};
		attrs['on' + eventName] = m.withAttr(propName, propFunc);
		attrs[propName] = propFunc();
		return attrs;
	}
}();
