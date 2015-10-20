(function () {
	'use strict';

	console.log(process.version, process.arch, process.platform);

	function visualize(src) {
		var dst = {};
		Object.getOwnPropertyNames(src).
		forEach(function (p) {
			try {
				// dst[p] = src[p];
				dst[p] = Object.getOwnPropertyDescriptor(src, p);
			} catch (e) {
				dst[p] = e;
			}
		});
		return dst;
	}

	function showvis(tag, src) {
		var dst = visualize(src);
		console.log('\n***************', tag);
		console.log(dst);
		for (var p in dst) {
		}
	}

	showvis('Object.prototype', (Object.prototype));
	showvis('Function.prototype', (Function.prototype));
	showvis('Object', (Object));
	showvis('Function', (Function));
	showvis('Function 1', (function (x,y) {}));
	showvis('Function 2', (Function ('"use strict"; return')));

})();

