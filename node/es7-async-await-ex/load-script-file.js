(function () {
	var script = document.createElement('script');
	window.loadScriptFile = function (scriptFile) {
		script.src = scriptFile;
		document.writeln(script.outerHTML);
		console.info('loading ' + scriptFile);
	};
})();
