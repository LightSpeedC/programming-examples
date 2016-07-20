void function () {
	'use strict';

	focus();

	const version = 'version: 0.0.8 (2016/07/20)';
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
	const maxFiles = m.prop(3000);
	const maxTotalFiles = m.prop(100000);

	const targetDir = process.env.AAA_TARGET_DIR;
	const text = m.prop('');
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
			'フォルダあたりの最大検索ファイル数を変更できます (超えたらスキップ)',
			'トータルの最大検索ファイル数を変更できます (超えたら検索をキャンセル)',
			'新旧のレイアウトを切替できます → 後で削除する予定',
			'×ワイルドカード検索はまだできません',
			'×あまりたくさんのファイルを検索するとハングする可能性があります',
		];
		return m('font[color=gray]', {}, m('ul', list.map(x => m('li', x))));
	}

	// リリース・ノート表示
	function releaseNotesView() {
		const list = [
			'0.0.8 (2016/07/20): 旧レイアウト削除',
			'0.0.7 (2016/06/16): 最大検索ファイル数の入力',
			'0.0.6 (2016/06/14): ルート・フォルダのリンク不具合修正、最大検索ファイル数制限、ほか',
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
			'AND/OR検索したい',
			'ワイルドカード検索したい',
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
					includes() ? m('div', '「', includes(), '」を含む') : '',
					excludes() ? m('div', '「', excludes(), '」を含まない') : '',
					m('div', '最大ファイル数/フォルダ:「', maxFiles(), '」'),
					m('div', '最大ファイル数/トータル:「', maxTotalFiles(), '」')
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
						'を含まない'),
					m('div',
						'最大ファイル数/フォルダ:',
							m('input', m_on('change', 'value', maxFiles,
							{placeholder: '最大ファイル数/フォルダ', size: 10}))),
					m('div',
						'最大ファイル数/トータル:',
							m('input', m_on('change', 'value', maxTotalFiles,
							{placeholder: '最大ファイル数/トータル', size: 10})))
				]
			),
			m('hr', {key: 'hr-search'}),

			// メッセージ
			m('div', {key: 'message'}, m('b', message())),
			m('hr', {key: 'hr-message'}),

			// 検索結果
			myViewResult(),
			m('hr', {key: 'hr-result'}),

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
					}
					if (child && !child[HIDE_PROP])
						vdom.push(viewNode(nodePath.concat(prop), child, i + 1, n, txt, incl, excl));
					return vdom;
				})
			];
		}
		else
			return [];
	}

	// 結果表示 ツリー形式
	function myViewResult() {
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
			findController.maxFiles = maxFiles();
			findController.maxTotalFiles = maxTotalFiles();

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
		return;
	}

	// ファイルのあるフォルダを開く
	function showItemInFolder(file) {
		blur();
		electron.shell.showItemInFolder(file);
		return;
	}

	// デバッグ表示
	function debugView() {
		const list = [
			'カレント作業ディレクトリ process.cwd(): ' + process.cwd(),
			'ディレクトリ名 __dirname: ' + __dirname,
			'ファイル名 __filename: ' + __filename,
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
