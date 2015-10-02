// コンポーネント定義
this.taskListComponent = function () {
	'use strict';

	var mx = 'h1 div form input hr table tr td pre span'.split(' ').reduce(
		function (mx, tag) { mx[tag] = m.bind(m, tag); return mx; }, {});
	mx.button   = m.bind(m, 'button[type=button]');
	mx.submit   = m.bind(m, 'button[type=submit]');
	mx.reset    = m.bind(m, 'button[type=reset]');
	mx.checkbox = m.bind(m, 'input[type=checkbox]');

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
		controller: function (args) {
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
			if (args && args.list)
				importList(args.list);

			// 引数に渡されたtaskデータリストurlからTaskのリストに追加
			if (args && args.url)
				m.request({method: 'GET', url:args.url})
					.then(importList);

			// 新しいTaskを作成する前の、入力中のTaskの名前を保持するスロット
			var titleInput = m.prop(''), titleInputElem;

			// Taskをリストに登録し、ユーザが使いやすいようにtitleフィールドをクリアする
			function addTitleInput() {
				var val = titleInput() || titleInputElem.value;
				if (val) {
					addTask({title: val});
					titleInput('');
				}
				return false;
			}

			// Enterキーに対応
			function configTitleInput(elem, isInit) {
				if (isInit) return;
				elem.focus();
				titleInputElem = elem;
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
			var taskToEdit = null;  // 編集中のTask
			var taskToEditElem;     // 編集中のTaskのDOM要素 (ie8対応)
			var saveTitleToEdit;    // 編集開始時のタイトル
			// タスク編集モードをトグル
			function toggleEditTask(task) {
				if (taskToEdit) {
					var val = taskToEditElem.value;
					if (val) taskToEdit.title(val);
					else taskToEdit.title(saveTitleToEdit);
					taskToEdit = null;
				}
				else {
					taskToEdit = task;
					if (task) saveTitleToEdit = task.title();
				}
				return false;
			}
			// 編集するinputを構成
			function configEditTask(elem, isInit) {
				if (isInit) return;
				elem.focus();
				taskToEditElem = elem;
			}

			// DEBUGフラグ
			var debugFlag = m.prop(false);

			this.view = function view(ctrl) {
				return [
					mx.h1('Task管理アプリ'),
					mx.div(['タスク: ',
						mx.form({onsubmit: addTitleInput},
							mx.input(m_on('change', 'value', titleInput,
								{placeholder: '新しいタスクを入力',
								 config: configTitleInput, autofocus: true})),
							mx.submit({onclick: addTitleInput}, '追加'))
					]),
					mx.hr(),
					mx.div(['表示: ',
						mx.button({onclick: function () { dispMode = 0; }},
							[(dispMode === 0 ? '★': '') + '全て', mx.span(taskList.length)]),
						mx.button({onclick: function () { dispMode = 2; }},
							[(dispMode === 2 ? '★': '') + '未了', mx.span(countUndone())]),
						mx.button({onclick: function () { dispMode = 1; }},
							[(dispMode === 1 ? '★': '') + '完了', mx.span(countDone())])
					]),
					mx.div(['操作: ',
						mx.button({onclick: checkAll}, '全て完了/未了'),
						mx.button({onclick: removeAllDone}, '完了タスクを全て削除')
					]),
					mx.hr(),
					mx.table([taskList.map(function(task) {
						var attrs = {key: task.key};
						if (dispMode === 1 && !task.done() ||
							dispMode === 2 &&  task.done())
								attrs.style = {display: 'none'};
						return mx.tr(attrs,
							task === taskToEdit ? [
								//編集
								mx.td({colspan:2}),
								mx.td({},
									mx.form({onsubmit: toggleEditTask.bind(null, null)},
										mx.input(m_on('change', 'value', task.title,
											{onblur: toggleEditTask.bind(null, null),
											 config: configEditTask})))
								)] : [
								//表示
								mx.td([
									mx.reset({onclick: removeTask.bind(null, task)}, '削除')
								]),
								mx.td([
									mx.checkbox(m_on('click', 'checked', task.done))
								]),
								mx.td({style: {textDecoration: task.done() ? 'line-through' : 'none'},
									 ondblclick: toggleEditTask.bind(null, task)},
									task.title())]
						);
					})]),
					mx.div('※ダブルクリックで編集'),
					//DEBUG表示
					mx.checkbox(m_on('click', 'checked', debugFlag)), 'dbg',
					!debugFlag() ? [] :
					mx.pre({style:{color:'green', backgroundColor:'lightgray'}},
						JSON.stringify(taskList, null, '  ').split('\n').map(function (s) {
							return mx.div(s);
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

	return taskListComponent;

}();
