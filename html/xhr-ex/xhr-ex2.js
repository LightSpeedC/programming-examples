// http://hakuhin.jp/js/xmlhttprequest.html
// https://ja.wikipedia.org/wiki/XMLHttpRequest

	var isNode = typeof process === 'object' && process && process.nextTick;

	var createXMLHttpRequest = isNode ?
	function createXMLHttpRequest() { return null; } :
	function createXMLHttpRequest() {
		try { return new XMLHttpRequest(); } catch (e) {}
		try { return new ActiveXObject('MSXML2.XMLHTTP.6.0');	} catch (e) {}
		try { return new ActiveXObject('MSXML2.XMLHTTP.3.0');	} catch (e) {}
		try { return new ActiveXObject('MSXML2.XMLHTTP');		} catch (e) {}
		try { return new ActiveXObject('Microsoft.XMLHTTP');	} catch (e) {}
		return null;
	}
