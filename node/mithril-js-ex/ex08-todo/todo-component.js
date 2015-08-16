//コンポーネント定義
this.taskListComponent = function () {
	'use strict';

	//モデル: Taskクラスは2つのプロパティ(title : string, done : boolean)を持つ
	function Task(task) {
		this.title = m.prop(task && task.title || '');
		this.done  = m.prop(task && task.done  || false);
		this.key = (new Date() - 0) + ':' + Math.random();
	};

	//モデル: TaskListクラスはTaskオブジェクトの配列
	var TaskList = Array;

	//コントローラ・オブジェクトctrlは
	//表示されているTaskのリスト(list)を管理し、
	//作成が完了する前のTaskのタイトル(title)を格納したり、
	//Taskを作成して追加(add)が可能かどうかを判定し、
	//Taskが追加された後にテキスト入力をクリアする

	//このアプリケーションは、taskListComponentコンポーネントでコントローラとビューを定義する
	var taskListComponent = {

		//コントローラは、モデルの中のどの部分が、現在のページと関連するのかを定義している
		//この場合は1つのコントローラ・オブジェクトctrlですべてを取り仕切っている
		controller: function (args) {
			var ctrl = this;

			//アクティブなTaskのリスト
			ctrl.list = new TaskList();

			//引数に渡されたtaskデータリストlistからTaskのリストに追加
			if (args && args.list) {
				args.list.forEach(function (task) {
					ctrl.list.push(new Task(task));
				});
			}

			//引数に渡されたtaskデータリストurlからTaskのリストに追加
			if (args && args.url) {
				m.request({method: 'GET', url:args.url}).then(function (list) {
					list.forEach(function (task) {
						ctrl.list.push(new Task(task));
					});
				});
			}

			//新しいTaskを作成する前の、入力中のTaskの名前を保持するスロット
			ctrl.title = m.prop('');

			//Taskをリストに登録し、ユーザが使いやすいようにtitleフィールドをクリアする
			ctrl.add = function () {
				if (ctrl.title()) {
					ctrl.list.push(new Task({title: ctrl.title()}));
					ctrl.title('');
				}
			};

			//Enterキーに対応
			ctrl.configInput = function (elem, isInit) {
				elem.focus();
				if (isInit) return;
				elem.onkeypress = function (e) {
					if ((e || event).keyCode === 13)
						m_delay(function () { ctrl.add(); /*elem.focus();*/ });
					return true;
				};
			};

			//完了タスクの数
			ctrl.countDone = function () {
				return ctrl.list.filter(function (task) {
					return task.done();
				}).length;
			};

			//未了タスクの数
			ctrl.countUndone = function () {
				return ctrl.list.filter(function (task) {
					return !task.done();
				}).length;
			};

			//完了タスクを全て削除(未了タスクを残す)
			ctrl.removeAllDone = function () {
				ctrl.list = ctrl.list.filter(function (task) {
					return !task.done();
				});
			};

			//全て完了/未了
			ctrl.checkAll = function () {
				var state = ctrl.countUndone() !== 0;
				ctrl.list.forEach(function (task) { task.done(state); });
			};

			//削除
			ctrl.removeTask = function (todoToRemove) {
				ctrl.list = ctrl.list.filter(function (task) {
					return task !== todoToRemove;
				});
			};

			//表示モード
			ctrl.mode = 0; //0:ALL, 1:DONE, 2:UNDONE

			//編集モード
			ctrl.taskEdit = undefined;
			ctrl.toggleEdit = function (task) {
				if (ctrl.taskEdit) {
					if (!ctrl.taskEdit.title())
						ctrl.taskEdit.title(ctrl.saveTitleToEdit);
					ctrl.taskEdit = undefined;
				}
				else {
					ctrl.taskEdit = task;
					if (task)
						ctrl.saveTitleToEdit = task.title();
				}
			};
			ctrl.configEdit = function (elem, isInit) {
				elem.focus();
				if (isInit) return;
				elem.onkeypress = function (e) {
					if ((e || event).keyCode === 13)
						m_delay(ctrl.toggleEdit);
					return true;
				};
			};

		},

		//ビュー
		view: function (ctrl) {
			return [
				m('h1', 'Task管理アプリ'),
				m('div', ['タスク: ',
					m('input', m_on('change', 'value', ctrl.title,
						{autofocus: true,
						 placeholder: '新しいタスクを入力',
						 config: ctrl.configInput})),
					m('button[type=submit]', {onclick: ctrl.add}, '追加')
				]),
				m('hr'),
				m('div', ['表示: ',
					m('button[type=button]', {onclick: function () { ctrl.mode = 0; }},
						[(ctrl.mode === 0 ? '★': '') + '全て', m('span', ctrl.list.length)]),
					m('button[type=button]', {onclick: function () { ctrl.mode = 2; }},
						[(ctrl.mode === 2 ? '★': '') + '未了', m('span', ctrl.countUndone())]),
					m('button[type=button]', {onclick: function () { ctrl.mode = 1; }},
						[(ctrl.mode === 1 ? '★': '') + '完了', m('span', ctrl.countDone())])
				]),
				m('div', ['操作: ',
					m('button[type=button]', {onclick: ctrl.checkAll}, '全て完了/未了'),
					m('button[type=button]', {onclick: ctrl.removeAllDone}, '完了タスクを全て削除')
				]),
				m('hr'),
				m('table', [ctrl.list.map(function(task) {
					var attrs = {key: task.key};
					if (ctrl.mode === 1 && !task.done() ||
						ctrl.mode === 2 &&  task.done())
							attrs.style = {display: 'none'};
					return m('tr', attrs,
						task === ctrl.taskEdit ? [
							//編集
							m('td', {colspan:2}),
							m('td', [
								m('input', m_on('change', 'value', task.title,
									{onblur: ctrl.toggleEdit.bind(ctrl, null), config: ctrl.configEdit}))
							])] : [
							//表示
							m('td', [
								m('button[type=reset]', {onclick: ctrl.removeTask.bind(null, task)}, '削除')
							]),
							m('td', [
								m('input[type=checkbox]', m_on('click', 'checked', task.done))
							]),
							m('td',
								{style: {textDecoration: task.done() ? 'line-through' : 'none'},
								 ondblclick: ctrl.toggleEdit.bind(ctrl, task)},
								task.title())]
					);
				})]),
				m('div', '※ダブルクリックで編集')
			];
		}
	};

	//HTML要素のイベントと値にプロパティを接続するユーティリティ
	function m_on(eventName, propName, propFunc, attrs) {
		attrs = attrs || {};
		attrs['on' + eventName] = m.withAttr(propName, propFunc);
		attrs[propName] = propFunc();
		return attrs;
	}

	//遅延実行および再描画
	function m_delay(fn) {
		setTimeout(function () {
			fn();
			m.redraw(true);
		}, 0);
	}

	return taskListComponent;

}();
