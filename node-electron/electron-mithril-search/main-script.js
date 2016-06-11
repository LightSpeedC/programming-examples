void function () {
	'use strict';

	focus();

	const version = 'version: 0.0.3 (2016/06/11)';
	const path = require('path');
	const spawn = require('child_process').spawn;
	const aa = require('aa');
	const findDirFiles = require('./find-dir-files');
	const findController = {isCancel:false, cancel};

	const debugFlag = m.prop(false);
	const includes = m.prop('');
	const excludes = m.prop('');
	const message = m.prop('検索できます');

	const targetDir = process.env.AAA_TARGET_DIR;
	const text = m.prop('');
	let files = [];
	let filesIsDirty = false;
	let wholeObject = {};
	let timer;

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
						m('button', {onclick: cancel}, 'ｷｬﾝｾﾙ'),
						m('b', m('font[color=red]', text()))),
					m('div', includes()),
					m('div', excludes())
				] : [
					m('form', {onsubmit: search},
						m('div',
							m('input', m_on('change', 'value', text,
								{autofocus: true, placeholder: '検索したい文字列', size: 100})),
							m('button[type=submit]', {onclick: search}, '検索'))),
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
			m('div', {key: 'result'}, myViewResult()), // 検索結果
			m('hr', {key: 'hr3'}),
			m('div', {key:'version'}, version), // バージョン
			// デバッグ表示
			m('div', {key: 'debug'},
				m('input[type=checkbox]',
					m_on('click', 'checked', debugFlag)),
				'debug', (debugFlag() ? debugView() : ''))
		];
	}

	// 結果
	function myViewResult() {
		if (filesIsDirty) files = files.sort();
		filesIsDirty = false;
		const incl = includes();
		const excl = excludes();
		return files
			.filter(file => file.includes(incl))
			.filter(file => !excl || !file.includes(excl))
			.map(file => {
			const dirs = file.split('\\');
			dirs.pop();
			const dir = dirs.join('\\');
			return m('div', {key: file},
				m('span',
					{style: {color: 'green'},
					 onclick: () => openExternal(dir)}, '[ﾌｫﾙﾀﾞ]'),
				m('span',
					{style: {color: 'blue'},
					 onclick: () => openExternal(file)}, '[ﾌｧｲﾙ]'),
				m('span',
					' ' + file.substr(targetDir.length))
			);
		});
	}

	// 検索コールバック
	function progressCallback(object) {
		const file = object.file;
		files.push(file);
		filesIsDirty = true;
		wholeObject = object.wholeObject;
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
					progressCallback,
					wholeObject,
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
				('process.cwd(): ' + process.cwd()),
				('\n\nprocess.pid: ' + process.pid),
				('\n\nprocess.versions: ' + JSON.stringify(process.versions, null, '\t')),
				('\n\nprocess.env: ' + JSON.stringify(process.env, null, '\t'))
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
