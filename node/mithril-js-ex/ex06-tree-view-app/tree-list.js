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

for (var i = 0; i < 10; ++i)
	console.log('');

function range(n) {
	var arr = Array(n);
	for (var i = 0; i < n; ++i)
		arr[i] = i;
	return arr;
}

this.treeListComponent = {
	controller: function (title, treeUrl, listUrl) {
		var ctrl = this;
		ctrl.title = title;
		ctrl.treeUrl = treeUrl;
		ctrl.listUrl = listUrl;
		ctrl.tree = m.request({method: 'GET', url: treeUrl + '?' + Date.now()});
		ctrl.list = m.request({method: 'GET', url: listUrl + '?' + Date.now()});
		ctrl.tree.then(function () {
			function getDepth(node, level) {
				if (!node || !node.children) return level;
				return node.children.map(function (child) {
					return getDepth(child, level + 1);
				}).reduce(function (a, b) { return a > b ? a : b; });
			}
			ctrl.depth = Math.max(getDepth(ctrl.tree(), 1), 5);
		});
	},
	view: function (ctrl) {
		function deepView(node, list, level, indent, hide) {
			if (!node) return [];
			if (!level) level = 0;
			if (!indent) indent = '';
			var onclick = function () {
				node.hide = !node.hide;
				console.log('clicked: ' + node.name + ' ' + (node.hide ? 'off': 'ON!!!'));
			}
			function getItem(elem, item, defaultValue) {
				item.split(':').forEach(function (index) {
					if (elem) elem = elem[index];
				});
				return elem || defaultValue;
			}
			return [
				m('tr', hide ? {style: {display: 'none'}} : {}, [
					//indent,
					range(level).map(function () { return m('td'); }),
					m('td',
							!node.children ? {colspan: ctrl.depth - level} :
							{colspan: ctrl.depth - level, onclick: onclick, ondblclick: onclick},
							node.name + (!node.children ? '' : node.hide ? '▼' : '△')),
					list.map(function (elem) {
						var s = null;
						if (node.item) s = getItem(elem, node.item, null);
						return m('td', s ? {} : {bgcolor: '#cccccc'}, s ? s : '-');
					})
				]),
				!node.children ? '' :
				node.children.map(function (child) {
					return deepView(child, list, level + 1, [m('td', ' '), indent], hide || node.hide);
				})
			];
		}
		return [
			m('h1', {onclick: function () {
						ctrl.hide = !ctrl.hide;
						console.log('clicked: ' + ctrl.title);
					}},
					ctrl.title + (ctrl.hide ? '▼' : '△')),
			m('div', ctrl.hide ? {style: {display: 'none'}} : {}, [
				m('table', {border: 1, cellspacing: 1, cellpadding: 1, bgcolor: '#eeffff'}, [
					m('tr', {bgcolor: '#cceecc'}, [
						range(ctrl.depth).map(function (i) {
							return m('th', '階層' + (i + 1));
						}),
						ctrl.list().map(function (elem) {
							return m('th', elem.name);
						})
					]),
					deepView(ctrl.tree(), ctrl.list())
				]),
				'データ・ダウンロード: ',
				m('a', {href: ctrl.treeUrl}, ctrl.treeUrl), ', ',
				m('a', {href: ctrl.listUrl}, ctrl.listUrl)
			])
		];
	}
};
