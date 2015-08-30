// https://gist.github.com/Contra/2709462
	var ids = ["Msxml2.XMLHTTP", "Microsoft.XMLHTTP", "Msxml2.XMLHTTP.4.0"];
	if (typeof XMLHttpRequest === "undefined") {
		for (var i = 0; i < ids.length; i++) {
			try {
				new ActiveXObject(ids[i]);
				window.XMLHttpRequest = function() {
					return new ActiveXObject(ids[i]);
				};
				break;
			} catch (e) {}
		}
	}
