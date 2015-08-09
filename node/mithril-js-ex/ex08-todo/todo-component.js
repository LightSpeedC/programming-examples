//コンポーネント定義
this.todoComponent = function () {
	'use strict';

	//モデル: Todoクラスは2つのプロパティ(description : string, done : boolean)を持つ
	function Todo(data) {
		this.description = m.prop(data && data.description || '');
		this.done        = m.prop(data && data.done || false);
		this.key = (new Date() - 0) + ':' + Math.random();
	};

	//モデル: TodoListクラスはTodoオブジェクトの配列
	var TodoList = Array;

	//コントローラ・オブジェクトctrlは
	//表示されているTodoのリスト(list)を管理し、
	//作成が完了する前のTodoの説明(description)を格納したり、
	//Todoを作成して追加(add)が可能かどうかを判定し、
	//Todoが追加された後にテキスト入力をクリアする

	//このアプリケーションは、todoComponentコンポーネントでコントローラとビューを定義する
	var todoComponent = {

		//コントローラは、モデルの中のどの部分が、現在のページと関連するのかを定義している
		//この場合は1つのコントローラ・オブジェクトctrlですべてを取り仕切っている
		controller: function (args) {
			var ctrl = this;

			//アクティブなToDoのリスト
			ctrl.list = new TodoList();

			//引数に渡されたtodoデータリストlistからToDoのリストに追加
			if (args && args.list) {
				args.list.forEach(function (data) {
					ctrl.list.push(new Todo(data));
				});
			}

			//引数に渡されたtodoデータリストurlからToDoのリストに追加
			if (args && args.url) {
				m.request({method: 'GET', url:args.url}).then(function (list) {
					list.forEach(function (data) {
						ctrl.list.push(new Todo(data));
					});
				});
			}

			//新しいToDoを作成する前の、入力中のToDoの名前を保持するスロット
			ctrl.description = m.prop('');

			//ToDoをリストに登録し、ユーザが使いやすいようにdescriptionフィールドをクリアする
			ctrl.add = function () {
				if (ctrl.description()) {
					ctrl.list.push(new Todo({description: ctrl.description()}));
					ctrl.description('');
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
				return ctrl.list.filter(function (todo) {
					return todo.done();
				}).length;
			};

			//未了タスクの数
			ctrl.countUndone = function () {
				return ctrl.list.filter(function (todo) {
					return !todo.done();
				}).length;
			};

			//完了タスクを全て削除(未了タスクを残す)
			ctrl.removeAllDone = function () {
				ctrl.list = ctrl.list.filter(function (todo) {
					return !todo.done();
				});
			};

			//全て完了/未了
			ctrl.checkAll = function () {
				var state = ctrl.countUndone() !== 0;
				ctrl.list.forEach(function (todo) { todo.done(state); });
			};

			//削除
			ctrl.removeTodo = function (todoToRemove) {
				ctrl.list = ctrl.list.filter(function (todo) {
					return todo !== todoToRemove;
				});
			};

			//表示モード
			ctrl.mode = 0; //0:ALL, 1:DONE, 2:UNDONE

			//編集モード
			ctrl.todoEdit = null;
			ctrl.toggleEdit = function (todo) {
				ctrl.todoEdit = ctrl.todoEdit ? null : todo;
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
				m('h1', 'ToDoアプリ'),
				m('div', ['タスク: ',
					m('input', m_connect('onchange', 'value', ctrl.description,
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
				m('table', [ctrl.list.map(function(todo) {
					var attrs = {key: todo.key};
					if (ctrl.mode === 1 && !todo.done() ||
						ctrl.mode === 2 &&  todo.done())
							attrs.style = {display: 'none'};
					return m('tr', attrs, [
						m('td', [
							m('button[type=reset]', {onclick: ctrl.removeTodo.bind(null, todo)}, '削除')
						]),
						m('td', [
							m('input[type=checkbox]', m_connect('onclick', 'checked', todo.done))
						]),
						todo === ctrl.todoEdit ?
							//編集
							m('td', [
								m('input', m_connect('onchange', 'value', todo.description,
									{onblur: ctrl.toggleEdit, config: ctrl.configEdit}))
							]) :
							//表示
							m('td',
								{style: {textDecoration: todo.done() ? 'line-through' : 'none'},
								 ondblclick: ctrl.toggleEdit.bind(null, todo)},
								todo.description())
					]);
				})]),
				m('div', '※ダブルクリックで編集')
			];
		}
	};

	//HTML要素のイベントと値にプロパティを接続するユーティリティ
	function m_connect(onEventName, propName, propFunc, attrs) {
		attrs = attrs || {};
		attrs[onEventName] = m.withAttr(propName, propFunc);
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

	return todoComponent;

}();
