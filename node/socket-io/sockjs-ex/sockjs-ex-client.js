// SockJS
var sock = new SockJS('https://localhost:9050/echo');
sock.onopen = function() {
	console.log('open');
};
sock.onmessage = function(e) {
	console.log('message', e.data);
};
sock.onclose = function() {
	console.log('close');
};

sock.send('test');
sock.close();
