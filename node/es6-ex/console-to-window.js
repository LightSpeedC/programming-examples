(function (global) {
	'use strict';

	function f() {}
	if (typeof console !== 'object') global.console = {log:f, info:f, error:f, warn:f, debug:f};

	var colors = {log:'black', info:'green', error:'red', warn:'orange', debug:'blue'};

	var $consoleToWindow = document.createElement('pre');

	var ready = false;

	window.onload = function (onload) {
		return function () {
			document.body.appendChild($consoleToWindow);
			if (onload) onload();
			ready = true;
		};
	} (window.onload);

	function pr() {
		var ctx = this || 'log';
		var div = document.createElement('div');
		div.setAttribute('style', 'color: ' + colors[ctx]);
		var msg = ctx + ': ' + [].slice.call(arguments).join(' ');

		if (typeof div.textContent === 'string')
			div.textContent = msg;
		else
			div.innerText = msg;

		$consoleToWindow.appendChild(div);
	}

	['log', 'info', 'error', 'warn', 'debug'].forEach(function (prop) {
		console[prop] = function (f) {
			return function () {
				f.apply(console, arguments);
				pr.apply(prop, arguments);
			};
		} (console[prop]);
	});

})(typeof global === 'object' ? global :
	typeof window === 'object' ? window :
	typeof self   === 'object' ? self : this);
