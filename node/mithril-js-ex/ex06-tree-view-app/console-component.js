if (typeof console === 'undefined')
	window.console = {log: function () {}, info: function () {}, warn: function () {}, error: function () {}};

this.consoleComponent = {
	controller: function (args) {
		var ctrl = this;
		ctrl.limit = args && args.limit ? args.limit : 10;
		ctrl.list = [];
		ctrl.push = function (msg) {
			ctrl.list.push({key:(new Date() - 0)+':'+Math.random(), msg:msg});
			if (ctrl.list.length > ctrl.limit) ctrl.list.shift();
		};

		window.console = function (console) {
			var c = {};
			for (var p in console)
				if (typeof console[p] === 'function')
					c[p] = function (p, f) {
						return function () {
							f && f.apply(console, arguments);
							ctrl.push(p + ': ' + [].slice.call(arguments).join(' '));
							//m.redraw(true);
						}
					}(p, console[p]);
			return c;
		} (window.console);

		if (console && console.log)
			console.log('console.log used');
	},
	view: function (ctrl) {
		return m('pre', [
			ctrl.list.map(function (item) {
				return m('div', {key:item.key}, item.msg);
			})
		]);
	}
};
