'use strict';
var url = require('url');
var o = {};
var defport = {'http:':80, 'https:':443};
function a(u){
	var x = url.parse(u.indexOf('//') >= 0 ? u : u = 'http://' + u);
	var n = getPathObjects(o, [x.protocol.split(':')[0]]
		.concat(x.hostname.split('.').reverse())
		.concat(x.port || defport[x.protocol])
		.concat(x.path.split('/').filter(e => e)));
	console.log(u);
	//console.log(x);
	console.log();
}
function getPathObjects(o, p) {
	var n = o;
	var a = [n];
	p.forEach(e => {
		if (!n.hasOwnProperty(e)) n[e] = {};
		n = n[e];
		if (!n._) n._ = {count:0, time:Date.now(), size:0};
		n._.count++;
		n._.time = Date.now();
		n._.size += 100;
		a.push(n);
	});
	//console.log(p);
	return a;
}
module.exports = getPathObjects;

if (module === require.main) {
	a('http://www.google.com/index.html');
	a('https://www.google.com/index.html');
	a('http://www.facebook.com/index.html');
	a('https://www.facebook.com/index.html');
	a('http://www.group.net/index.html');
	a('https://www.group.net/index.html');
	a('www.facebook.com/index.html');
	a('www.facebook.com:80');
	console.log(require('util').inspect(o, {colors:true, depth:null}));
}
