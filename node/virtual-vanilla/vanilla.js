// http://youmightnotneedjquery.com/

void function () {
	'use strict';

	window.vv = vv;
	vv.mount = mount;
	vv.text = text;

	var tags = ['div', 'hr', 'br', 'p', 'input', 'a'];
	for (var i in tags)
		vv[tags[i]] = vv.bind(vv, tags[i]);

	function vv(tag, attrs, children) {
		if (tag === 'text') return text(attrs);
		var elem = document.createElement(tag);
		if (attrs && attrs.constructor !== Object)
			children = attrs, attrs = {};
		if (children && children.constructor !== Array)
			children = [children];
		for(var p in attrs)
			if (p.substr(0, 2) === 'on')
				elem.addEventListener(p.substr(2), attrs[p].bind(elem));
			else elem.setAttribute(p, attrs[p]);
		for(var i in children)
			elem.appendChild(typeof children[i] === 'object' ?
				children[i] : text(children[i]));
		return elem;
	}

	function text(nodeValue) {
		if (typeof nodeValue !== 'string') nodeValue = String(nodeValue);
		return document.createTextNode(nodeValue);
	}

	function mount(comp, elem) {
		elem.appendChild(comp);
	}
}();
