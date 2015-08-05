this.preTextComponent = {
	controller: function (args) {
		var ctrl = this;
		ctrl.title = args && args.title ? args.title : 'console';
		ctrl.limit = args && args.limit ? args.limit : 10;
		ctrl.list = [];
		ctrl.push = function (msg) {
			ctrl.list.push({key:(new Date() - 0) + ':' + Math.random(), msg:msg});
			if (ctrl.list.length > ctrl.limit) ctrl.list.shift();
		};

	},
	view: function (ctrl) {
		return [
			m('h3', ctrl.title),
			m('pre', [
				ctrl.list.map(function (item) {
					return m('div', {key:item.key}, item.msg);
				})
			])
		];
	}
};
