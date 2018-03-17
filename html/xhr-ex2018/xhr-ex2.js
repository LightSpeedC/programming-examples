function xhrSuccess () { this.callback.apply(this, this.arguments); }

function xhrError () { console.error(this.statusText); }

function loadFile (sURL, fCallback /*, argumentToPass1, argumentToPass2, etc. */) {
	var oReq = new XMLHttpRequest();
	oReq.callback = fCallback;
	oReq.arguments = Array.prototype.slice.call(arguments, 2);
	oReq.onload = xhrSuccess;
	oReq.onerror = xhrError;
	oReq.open("get", sURL, true);
	oReq.send(null);
}

////////////////////////////////////////////////////////////////////////////////

function showMessage (sMsg) {
	alert(sMsg + this.responseText);
}

loadFile("message.txt", showMessage, "New message!\n\n");
