// Date.now polyfill for IE8
if (!Date.now) Date.now = function now() { return new Date() - 0; };

// [].reduce polyfill for IE8
if (!Array.prototype.reduce)
	Array.prototype.reduce = function reduce(f) {
		var a = this[0];
		if (this.length <= 1) return a;
		for (var i = 1, n = this.length; i < n; ++i)
			a = f(this[i], a, i, this);
		return a;
	};

this.jsonShowComponent = function () {
	'use strict';

	for (var i = 0; i < 10; ++i)
		console.log('');

	// 範囲の配列を返す
	function range(n) {
		var arr = Array(n);
		for (var i = 0; i < n; ++i)
			arr[i] = i;
		return arr;
	}

	// 深さを返す
	function getDepth(node, level) {
		if (!node || !node.children) return level;
		return node.children.map(function (child) {
			return getDepth(child, level + 1);
		}).reduce(function (a, b) { return a > b ? a : b; });
	}

	// 数字をコンマ編集して文字列を返す
	function editComma(value) {
		var s = String(value);
		for (var i = s.length - 3; i > 0; i -= 3)
			s = s.substring(0, i) + ',' + s.substring(i);
		return s;
	}

	// コンポーネント
	var comp = {
		controller: function (args) {
			var ctrl = this;
			args = args || {};
			ctrl.title = args.title || 'タイトルなし';
			ctrl.url = args.url;
			ctrl.depth = 10;
			ctrl.tree = m.request({method:'GET', url:ctrl.url /*+ '?' + Date.now()*/, initialValue:[]});
			ctrl.tree.then(function () {
				ctrl.depth = Math.max(getDepth(ctrl.tree(), 1), 3);
			});
		},
		view: function (ctrl) {
			function deepView(node, level, indent, hide) {
				if (!node) return []; // 何もない時は空の配列を返す
				if (!level) level = 0; // レベルはゼロから開始
				if (!indent) indent = ''; // インデントは無しから開始
				if (!hide) hide = false; // 通常は表示する

				// クリック
				var onclick = function () {
					node.hide = !node.hide;
					console.log('クリック: ' + node.name + ' (' + node.item + ') ' + (node.hide ? 'off': 'ON!!!'));
				};

				// 値と、セルの表示属性
				var value = node.value, tdAttr = {};
				try {
					if (typeof value === 'string' && Number(value) == value)
						value = Number(value);
				} catch (e) {}

				// 未定義の場合
				if (typeof value === 'undefined') {
					tdAttr.bgcolor = '#eeeeee';
					tdAttr.align = 'center';
					value = '-';
				}
				// 数字の場合：コンマ編集する
				else if (typeof value === 'number') {
					tdAttr.align = 'right';
					value = editComma(value);
				}

				return [
					// 行
					m('tr', hide ? {style: {display: 'none'}} : {}, [
						range(level).map(function () { return m('td'); }), // レベルの数だけインデント

						// 項目の名称やタグ、△▼を表示
						m('td',
								!node.children ? {colspan: ctrl.depth - level} :
								{colspan: ctrl.depth - level, onclick: onclick, ondblclick: onclick},
								[node.name,
									m('font', {color: '#dddddd'}, ' (' + node.item + ')'),
									(!node.children ? '' : node.hide ? ' ▼' : ' △')]),

						// 項目の値を表示
						m('td', tdAttr, value)
					]),

					// 子供がいなければ
					!node.children ? '' :
					// 子供がいれば
					node.children.map(function (child) {
						return deepView(child, level + 1, [m('td', ' '), indent], hide || node.hide);
					})
				];
			}

			return [
				// デバッグ表示
				m('p', 'デバッグ: ?=の指定があれば: ', m('b', location.search)),
				m('p', 'デバッグ: データ・ダウンロード: ', m('b', m('a', {href: ctrl.url}, ctrl.url))),

				// タイトル表示
				m('h1', {onclick: function () {
							ctrl.hide = !ctrl.hide; // 表示/非表示を反転
							console.log('クリック: タイトル: ' + ctrl.title); // クリック!
						}},
						ctrl.title + (ctrl.hide ? '▼' : '△')),

				// 以下、テーブル(表)を表示
				m('div', ctrl.hide ? {style: {display: 'none'}} : {}, [
					m('table', {border: 1, cellspacing: 1, cellpadding: 1, bgcolor: '#eeffff'}, [
						m('tr', {bgcolor: '#cceecc'}, [
							range(ctrl.depth).map(function (i) {
								return m('th', '階層' + (i + 1));
							}),
							m('th', '　データ　')
						]),
						deepView(ctrl.tree())
					])
				])
			];
		}
	};

	return comp; // コンポーネント
}();
