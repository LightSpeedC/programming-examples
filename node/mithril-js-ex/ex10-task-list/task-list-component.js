// タスク・リストのコンポーネント定義
this.taskListComponent = function () {
	'use strict';

	// モデル: Taskクラスは2つのプロパティ(title : string, done : boolean)を持つ
	function Task(task) {
		this.title = m.prop(task && task.title || '');
		this.done  = m.prop(task && task.done  || false);
		this.key = (new Date - 0) + Math.random();
	}
	Task.prototype.toJSON = function () {
		return {title: this.title, done: this.done};
	};

	// コントローラ・オブジェクトctrlは
	// 表示されているTaskのリスト(list)を管理し、
	// 作成が完了する前のTaskのタイトル(title)を格納したり、
	// Taskを作成して追加(add)が可能かどうかを判定し、
	// Taskが追加された後にテキスト入力をクリアする

	// このアプリケーションは、taskListComponentコンポーネントでコントローラとビューを定義する
	var taskListComponent = {

		// コントローラは、モデルの中のどの部分が、現在のページと関連するのかを定義している
		// この場合は1つのコントローラ・オブジェクトctrlですべてを取り仕切っている
		controller: function (attrs) {

			// DEBUGフラグ
			var debug = m.prop(false);

			// アクティブなTaskのリスト
			var taskList = [];

			// Taskをタスクリストに追加
			function addTask(task) {
				taskList.push(new Task(task));
			}

			// データのリストからタスクリストに追加
			function importList(list) {
				list.forEach(addTask);
			}

			// 引数に渡されたtaskデータリストlistからTaskのリストに追加
			if (attrs && attrs.list)
				importList(attrs.list);

			// 引数に渡されたtaskデータリストurlからTaskのリストに追加
			if (attrs && attrs.url)
				m.request({method: 'GET', url:attrs.url})
					.then(importList);

			// 新しいTaskを作成する前の、入力中のTaskの名前を保持するスロット
			var titleInput = m.prop('');

			// Taskをリストに登録し、ユーザが使いやすいようにtitleフィールドをクリアする
			function addTitleInput() {
				if (titleInput()) {
					addTask({title: titleInput()});
					titleInput('');
				}
			}

			// Enterキーに対応
			function configTitleInput(elem, isInit) {
				if (isInit) return;
				elem.focus();
				elem.onkeypress = function (e) {
					if ((e || event).keyCode === 13)
						m_delay(function () { addTitleInput(); elem.focus(); });
					return true;
				};
			}

			// タスクが完了している?
			function taskIsDone(task) {
				return task.done();
			}

			// タスクが完了していない?
			function taskIsNotDone(task) {
				return !task.done();
			}

			// 完了タスクの数
			function countDone() {
				return taskList.filter(taskIsDone).length;
			}

			// 未了タスクの数
			function countUndone() {
				return taskList.filter(taskIsNotDone).length;
			}

			// 完了タスクを全て削除(未了タスクを残す)
			function removeAllDone() {
				taskList = taskList.filter(taskIsNotDone);
			}

			// 全て完了/未了
			function checkAll() {
				var state = countUndone() !== 0;
				taskList.forEach(function (task) { task.done(state); });
			}

			// 削除
			function removeTask(todoToRemove) {
				taskList = taskList.filter(function (task) {
					return task !== todoToRemove;
				});
			}

			// 表示モード
			var dispMode = 0; //0:ALL, 1:DONE, 2:UNDONE

			// 編集モード
			var taskToEdit; // 編集中のTask
			var saveTitleToEdit; // 編集開始時のタイトル
			// タスク編集モードをトグル
			function toggleEditTask(task) {
				if (taskToEdit) {
					if (!taskToEdit.title())
						taskToEdit.title(saveTitleToEdit);
					taskToEdit = undefined;
				}
				else {
					taskToEdit = task;
					if (task) saveTitleToEdit = task.title();
				}
			}
			// 編集するinputを構成
			function configEditTask(elem, isInit) {
				if (isInit) return;
				elem.focus();
				elem.onkeypress = function (e) {
					if ((e || event).keyCode === 13)
						m_delay(toggleEditTask);
					return true;
				};
			}

			this.view = function view(ctrl) {
				return [
					m('h1', 'Task管理アプリ'),
					m('div', ['タスク: ',
						m('input', m_on('change', 'value', titleInput,
							{placeholder: '新しいタスクを入力',
							 config: configTitleInput, autofocus: true})),
						m('button[type=submit]', {onclick: addTitleInput}, '追加')
					]),
					m('hr'),
					m('div', ['表示: ',
						m('button[type=button]', {onclick: function () { dispMode = 0; }},
							[(dispMode === 0 ? '★': '') + '全て', m('span', taskList.length)]),
						m('button[type=button]', {onclick: function () { dispMode = 2; }},
							[(dispMode === 2 ? '★': '') + '未了', m('span', countUndone())]),
						m('button[type=button]', {onclick: function () { dispMode = 1; }},
							[(dispMode === 1 ? '★': '') + '完了', m('span', countDone())])
					]),
					m('div', ['操作: ',
						m('button[type=button]', {onclick: checkAll}, '全て完了/未了'),
						m('button[type=button]', {onclick: removeAllDone}, '完了タスクを全て削除')
					]),
					m('hr'),
					m('table', [taskList.map(function(task) {
						var attrs = {key: task.key};
						if (dispMode === 1 && !task.done() ||
							dispMode === 2 &&  task.done())
								attrs.style = {display: 'none'};
						return m('tr', attrs,
							task === taskToEdit ? [
								// 編集
								m('td', {colspan:2}),
								m('td', [
									m('input', m_on('change', 'value', task.title,
										{onblur: toggleEditTask.bind(null, null), config: configEditTask}))
								])] : [
								// 表示
								m('td', [
									m('button[type=reset]', {onclick: removeTask.bind(null, task)}, '削除')
								]),
								m('td', [
									m('input[type=checkbox]', m_on('click', 'checked', task.done))
								]),
								m('td',
									{style: {textDecoration: task.done() ? 'line-through' : 'none'},
									 ondblclick: toggleEditTask.bind(null, task)},
									task.title())]
						);
					})]),
					m('hr'),
					m('div', '※ダブルクリックで編集'),
					m('input[type=checkbox]', m_on('click', 'checked', debug)), 'DEBUG',
					// DEBUG表示
					!debug() ? [] :
					m('pre', {style:{color:'green', backgroundColor:'lightgray'}},
						JSON.stringify(taskList, null, '  ').split('\n').map(function (x) {
							return m('div', x);
					}))
				];
			};

		},

		// ビュー
		view: function (ctrl) {
			return ctrl.view(ctrl);
		}
	};

	// HTML要素のイベントと値にプロパティを接続するユーティリティ
	function m_on(eventName, propName, propFunc, attrs) {
		attrs = attrs || {};
		attrs['on' + eventName] = m.withAttr(propName, propFunc);
		attrs[propName] = propFunc();
		return attrs;
	}

	// 遅延実行および再描画
	function m_delay(fn) {
		setTimeout(function () {
			fn();
			m.redraw(true);
		}, 0);
	}

	return taskListComponent;

}();
