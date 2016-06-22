function get(url) {
	return function(callback) {
		var xhr;
		if (window.ActiveXObject)
			xhr = new ActiveXObject("Microsoft.XMLHTTP");
		else
			xhr = new XMLHttpRequest();
		//else if (window.XMLHttpRequest) {
		//	xhr = new XMLHttpRequest();
		//	xhr.open("GET", url, false);
		//	xhr.send(null);
		//}

		xhr.open('GET', url, false);
		xhr.onload = function() {
			if (xhr.status == 200)
				callback(null, xhr.response);
			else
				callback(new Error(xhr.statusText));
		};
		xhr.onerror = function() {
			callback(new Error("Network Error"));
		};
		xhr.send();
	};
}
// http://www.html5rocks.com/ja/tutorials/es6/promises/
