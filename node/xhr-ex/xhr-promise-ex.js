// http://www.html5rocks.com/ja/tutorials/es6/promises/

function get(url) {
	// Return a new promise.
	return new Promise(function(resolve, reject) {
		// Do the usual XHR stuff
		var xhr = new XMLHttpRequest();
		xhr.open('GET', url);

		xhr.onload = function() {
			// This is called even on 404 etc
			// so check the status
			if (xhr.status == 200) {
				// Resolve the promise with the response text
				resolve(xhr.response);
			}
			else {
				// Otherwise reject with the status text
				// which will hopefully be a meaningful error
				reject(new Error(xhr.statusText));
			}
		};

		// Handle network errors
		xhr.onerror = function() {
			reject(new Error("Network Error"));
		};

		// Make the request
		xhr.send();
	});
}
