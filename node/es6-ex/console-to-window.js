(function (global) {
	'use strict';

	var styles = {
		log:   {color: 'black'},
		info:  {color: 'green'},
		debug: {color: 'blue'},
		warn:  {color: 'orange'},
		error: {color: 'red'}};

	if (typeof console === 'undefined') global.console = {};

	var $consoleToWindow = document.createElement('pre');

	var parent;

	console.mount = function (element) {
		if (!element) element = document.body;
		if (!element) {
			// elem and document.body are undefined
			window.onload = function (onload) {
				return function () {
					console.mount(parent);
					if (onload) onload();
				};
			} (window.onload);
			return;
		}
		if (element === parent) return parent;
		if (parent) parent.removeChild($consoleToWindow);
		parent = element;
		parent.appendChild($consoleToWindow);
		return parent;
	};

	console.setStyle = function (method, style) {
		styles[method] = style;
	};

	console.mount();

	function pr() {
		var ctx = this || 'log';
		var div = document.createElement('div');
		for (var i in styles[ctx])
			div.style[i] = styles[ctx][i];
		var msg = ctx + ': ' + [].slice.call(arguments).join(' ');

		if (typeof div.textContent === 'string')
			div.textContent = msg;
		else
			div.innerText = msg;

		$consoleToWindow.appendChild(div);
	}

	for (var method in styles)
		console[method] = function (method, fn) {
			return function () {
				if (typeof fn === 'function')
					fn.apply(console, arguments);
				pr.apply(method, arguments);
			};
		} (method, console[method]);

})(this ||
	typeof window !== 'undefined' ? window :
	typeof global !== 'undefined' ? global :
	typeof self   !== 'undefined' ? self : this);
