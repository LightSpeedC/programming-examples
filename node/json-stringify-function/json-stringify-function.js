// JSONもどき（値として関数を持つ）をJSON.stringifyしたりJSON.parseしたりする
// http://qiita.com/emadurandal/items/37fae542938907ef5d0c

// JSON.stringify の replacer と JSON.parse の reviewer で
//   function は toString を使う
// Function.prototype.toJSON を使う

(function () {
	'use strict';

	var o1 = {n1:123, n2:12.3, b1:true, b2:false, s1:'str"1"', s2:"str'2'",
		o1:{x:1,y:2}, a1:[1,2,3], d1: new Date,
		r1: /regex/, e1: new Error('err'), e2: TypeError('err'),
		f1:function(x,y) {return x+y}, f2:function f2(x,y) {return x*y},
		zz:{xx:11,toJSON:function(){return {xx:this.xx}}}};

	console.log('###########################################');
	console.log('# Standard JSON stringify indent 2 spc #');
	console.log(JSON.stringify(o1, null, '  '));

	console.log('# Standard JSON #');
	console.log('###########################################');
	console.log('# Standard JSON stringify & parse #');
	console.log(parse(JSON.stringify(o1)));
	console.log('###########################################');

	function filterDate(o) {
		var oo = {};
		for (var i in o)
			oo[i] = typeof o[i] === 'function' ? {$type: 'Function', $value: o[i] + ''} :
				typeof o[i] !== 'object' || !o[i] ? o[i] :
				o[i] instanceof Date   ? {$type: 'Date', $value: + o[i]} :
				o[i] instanceof RegExp ? {$type: 'RegExp', $value: o[i] + ''} :
				o[i] instanceof Error  ? {$type: o[i].constructor.name, $value: o[i].message} :
				filterDate(o[i]);
		return oo;
	}

	var s1 = JSON.stringify(filterDate(o1), null, '  ');
	console.log('# Special JSON stringify & parse #');
	console.log(parse(s1));
	console.log('###########################################');

	//var dateToJSON = Date.prototype.toJSON;
	//Date.prototype.toJSON = function () { return {$date: +this}; };

	var s1 = JSON.stringify(filterDate(o1), function (k, v) {
		//console.log('key:', k, ' \tval:', typeof v, v);
		if (typeof v === 'function') return {$type: 'Function', $value: v + ''};
		return v;
	}, '  ');

	//if (dateToJSON) Date.prototype.toJSON = dateToJSON;
	//else		delete Date.prototype.toJSON;

	console.log('# Special JSON stringify #');
	console.log(s1);
	console.log('###########################################');

	console.log('# Special JSON stringify & parse #');
	console.log(parse(s1));
	console.log('###########################################');

	function parse(str) {
		return JSON.parse(str, function (k, v) {
			if (typeof v === 'string')
				if (v.match(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z/))
					return new Date(v);
			if (typeof v === 'object' && v && v.$type) {
				if (v.$type === 'Function')
					return Function('return ' + v.$value)();
				if (v.$type === 'Date')
					return new Date(v.$value);
				if (v.$type === 'RegExp')
					return Function('return ' + v.$value)();
				return Function('return new ' + v.$type + '("' + v.$value + '")')();
			}
			return v;
		});
	}

})();
