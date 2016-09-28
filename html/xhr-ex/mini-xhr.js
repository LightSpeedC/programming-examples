// mini-xhr.js

// http://hakuhin.jp/js/xmlhttprequest.html
// https://ja.wikipedia.org/wiki/XMLHttpRequest

this.MiniXHR = function (MiniPromise) {
	'use strict';

	var isNode = typeof process === 'object' && process && process.nextTick;

	var createXMLHttpRequest = isNode ?
	function createXMLHttpRequest() { return null; } :
	function createXMLHttpRequest() {
		try { return new XMLHttpRequest(); } catch (e) {}
		try { return new ActiveXObject('MSXML2.XMLHTTP.6.0'); } catch (e) {}
		try { return new ActiveXObject('MSXML2.XMLHTTP.3.0'); } catch (e) {}
		try { return new ActiveXObject('MSXML2.XMLHTTP');     } catch (e) {}
		try { return new ActiveXObject('Microsoft.XMLHTTP');  } catch (e) {}
		return null;
	}

	function MiniXHR(baseUrl) {
		this.xhr = createXMLHttpRequest();
		this.baseUrl = baseUrl ? baseUrl : '';
	}

	MiniXHR.prototype.get = function get(url) {
		return this.request('GET', url); };

	MiniXHR.prototype.post = function post(url, data) {
		return this.request('POST', url, data); };

	MiniXHR.prototype.abort = function abort() {
		return this.xhr.abort(); };

	MiniXHR.prototype.request = isNode ?
	function request(method, url, data) {
		var baseUrl = this.baseUrl;
		console.log('%j', {method:method, url:url, data:data});
		return new MiniPromise(function (resolve, reject) {
			var http = require('http');
			var options = require('url').parse(baseUrl + url);
			options.method = method;
			if (typeof data !== 'undefined') options.headers = {'Content-Type': 'application/json'};
			var req = http.request(options, function (res) {
				var buffs = [];
				res.on('end', function () {
					resolve(Buffer.concat(buffs).toString());
				});
				res.on('readable', function () {
					var buff = res.read();
					if (buff) buffs.push(buff);
				});
			});
			req.on('error', reject);
			if (typeof data !== 'undefined') {
				req.end(JSON.stringify(data));
			}
			else req.end();
		}); // new Promise
	} :
	function request(method, url, data) {
		var xhr = this.xhr;
		var baseUrl = this.baseUrl;
		return new MiniPromise(function (resolve, reject) {
			xhr.onreadystatechange = function () {
				if (xhr.readyState == 4) { // DONE
					if (xhr.status >= 200 && xhr.status < 300) // OK
						resolve(xhr.responseText);
					else
						reject(new Error('status: ' + xhr.status));
				}
			}
			xhr.open(method, baseUrl + url);
			if (typeof data !== 'undefined') {
				xhr.setRequestHeader('Content-Type' , 'application/json');
				xhr.send(JSON.stringify(data));
			}
			else xhr.send();
		}); // new Promise
	}; // request

	MiniXHR.MiniPromise = MiniPromise;

	if (typeof module === 'object' && module && module.exports)
		module.exports = MiniXHR;

	return MiniXHR;

}(this.MiniPromise || require('./mini-promise'));
