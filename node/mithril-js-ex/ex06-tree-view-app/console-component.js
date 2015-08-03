var w = this;
if (typeof w.console === 'undefined')
	w.console = this.console || {
		log: function () {},
		info: function () {},
		warn: function () {},
		error: function () {}};

this.consoleComponent = {
	controller: function (args) {
		var ctrl = this;
		ctrl.limit = args && args.limit ? args.limit : 10;
		ctrl.list = [];
		ctrl.push = function (msg) {
			ctrl.list.push({key:(new Date() - 0)+':'+Math.random(), msg:msg});
			if (ctrl.list.length > ctrl.limit) ctrl.list.shift();
		};

		w.console = function (console) {
			var c = {};
			for (var p in console)
				if (typeof console[p] === 'function')
					c[p] = function (p, f) {
						return function () {
							f && f.apply(console, arguments);
							ctrl.push(p + ': ' + [].slice.call(arguments).join(' '));
						}
					}(p, console[p]);
			return c;
		} (w.console);

		if (console && console.log)
			console.log('console.log used');
	},
	view: function (ctrl) {
		return [
			m('h3', 'console'),
			m('pre', [
				ctrl.list.map(function (item) {
					return m('div', {key:item.key}, item.msg);
				})
			])
		];
	}
};
