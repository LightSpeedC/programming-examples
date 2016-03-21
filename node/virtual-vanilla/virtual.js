// http://youmightnotneedjquery.com/

void function () {
	'use strict';

	window.vv = vv;
	vv.mount = mount;
	vv.text = text;

	function vv(tag, attrs, children) {
		var vdom = {tag: tag};
		if (tag === 'text') {
			vdom.text = attrs;
			return vdom;
		}
		if (attrs && attrs.constructor === Array)
			children = attrs, attrs = {};
		if (attrs) vdom.attrs = attrs;
		if (children) vdom.children = children;
		return vdom;
	}

	function deepEquals(a, b) {
		if (a === b) return true;
		//console.log('***a:', a);
		//console.log('***b:', b);
		if (a == null || b == null) return false;
		if (typeof a === 'string'   || typeof b === 'string')   return false;
		if (typeof a === 'number'   || typeof b === 'number')   return false;
		if (typeof a === 'boolean'  || typeof b === 'boolean')  return false;
		if (typeof a === 'function' || typeof b === 'function') return false;
		if (typeof a !== 'object'   || typeof b !== 'object')   return false;
		if (a.constructor !== b.constructor) return false;
		if (a.constructor === Array) {
			if (a.length !== b.length) return false;
			for (var i = 0, n = a.length; i < n; ++i)
				if (!deepEquals(a[i], b[i])) return false;
			return true;
		}
		if (a.constructor === Object) {
			for (var i in a)
				if (!deepEquals(a[i], b[i])) return false;
			for (var i in b) {
				if (a[i] === b[i]) continue;
				if (a[i] == null) return false;
			}
			return true;
		}
		return false;
	}

	function vdom2rdom(vdom, oldvdom, oldrdom) {
		var rdom = oldrdom;
		if (typeof vdom === 'object' && vdom) {
			if (vdom.constructor !== Object) return vdom;
			vdom.rdom = rdom;
			if (vdom.tag === 'text') {
				if (oldvdom.tag === 'text') {
					if (vdom.text !== oldvdom.text)
						rdom.nodeValue = vdom.text;
				}
				else rdom = vdom.rdom = text(vdom.text);
				return rdom;
			}
			if (deepEquals(vdom, oldvdom))
				return rdom;
			rdom = vdom.rdom = rr(vdom.tag, vdom.attrs, vdom.children);
			return rdom;
		}
		else return text(vdom);
	}

	function rr(tag, attrs, children) {
		var elem = document.createElement(tag);
		if (attrs && attrs.constructor === Array)
			children = attrs, attrs = {};
		for(var p in attrs)
			if (p.substr(0, 2) === 'on')
				elem.addEventListener(p.substr(2), attrs[p].bind(elem));
			else elem.setAttribute(p, attrs[p]);
		for(var i in children)
			elem.appendChild(vdom2rdom(children[i]));
		return elem;
	}

	function text(nodeValue) {
		if (typeof nodeValue !== 'string') nodeValue = String(nodeValue);
		return document.createTextNode(nodeValue);
	}

	var mountList = [];

	function mount(comp, elem) {
		mountList.push({comp:comp, elem:elem});
		setTimeout(redraw, 20);
	}

	setInterval(redraw, 3000);

	function redraw() {
		for (var i in mountList) {
			var comp = mountList[i].comp;
			var elem = mountList[i].elem;

			var ctrl = mountList[i].ctrl;
			if (!ctrl && comp.controller)
				mountList[i].ctrl = ctrl = new comp.controller();

			var oldvdom = mountList[i].vdom;
			var newvdom = comp.view(ctrl);
			mountList[i].vdom = newvdom;

			var oldrdom = mountList[i].rdom;
			var newrdom = vdom2rdom(newvdom, oldvdom, oldrdom);
			mountList[i].rdom = newrdom;

			if (newrdom !== oldrdom) {
				elem.innerHTML = '';
				elem.appendChild(newrdom);
			}
		}
	}

}();
