(function (global) {
	var script = document.createElement('script');
	global.loadScriptFile = function (scriptFile) {
		script.src = scriptFile;
		document.writeln(script.outerHTML);
		console.info('loading ' + scriptFile);
	};
})(this || Function('return this')());
