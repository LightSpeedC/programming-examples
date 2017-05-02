// raf-request-animation-frame

// こんなコードを入れとけば未サポートブラウザも安心
(function (w, r) {
	w['r'+r] = w['r'+r] || w['webkitR'+r] || w['mozR'+r] || w['msR'+r] || w['oR'+r] ||
		function(c){ w.setTimeout(c, 1000 / 60); };
})(window, 'equestAnimationFrame');


(function () {
	// if (!Date.now) Date.now = function () { return new Date() - 0; };
	var startTime = Date.now();

	var content = document.getElementById('content');
	var countPerSeconds = [];
	requestAnimationFrame(function tick() {
		var index = Math.floor((Date.now() - startTime) / 1000);
		countPerSeconds[index] = (countPerSeconds[index] || 0) + 1;
		requestAnimationFrame(tick);
	});

	var content2 = document.getElementById('content2');
	var countPerSeconds2 = [];
	var FPS = 60, interval = 1000 / FPS;
	setTimeout(function tick2() {
		var index = Math.floor((Date.now() - startTime) / 1000);
		countPerSeconds2[index] = (countPerSeconds2[index] || 0) + 1;
		setTimeout(tick2, interval);
	}, interval);

	setInterval(function () {
		content.innerHTML = countPerSeconds.join(', ');
		content2.innerHTML = countPerSeconds2.join(', ');
	}, 1000);
})();
