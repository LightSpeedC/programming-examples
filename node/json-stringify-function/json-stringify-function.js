// JSONもどき（値として関数を持つ）をJSON.stringifyしたりJSON.parseしたりする
// http://qiita.com/emadurandal/items/37fae542938907ef5d0c

// JSON.stringify の replacer と JSON.parse の reviewer で
//   function は toString を使う
// Function.prototype.toJSON を使う

(function () {
	'use strict';

	var o1 = {n1:123, n2:12.3, b1:true, b2:false, s1:'str"1"', s2:"str'2'",
		o1:{x:1,y:2}, a1:[1,2,3], d1: new Date,
		f1:function(x,y) {return x+y}, f2:function f2(x,y) {return x*y},
		zz:{xx:11,toJSON:function(){return {xx:this.xx}}}};

	console.log(JSON.stringify(o1, null, '  '));

	console.log('###########################################');
	console.log(parse(JSON.stringify(o1)));
	console.log('###########################################');

	function filterDate(o) {
		var oo = {};
		for (var i in o)
			oo[i] = typeof o[i] !== 'object' || !o[i] ? o[i] :
				o[i] instanceof Date ? {$date: + o[i]} : filterDate(o[i]);
		return oo;
	}

	var s1 = JSON.stringify(filterDate(o1), function (k, v) {
		//console.log('key:', k, ' \tval:', typeof v, v);
		return v;
	}, '  ');
	console.log(parse(s1));

	var dateToJSON = Date.prototype.toJSON;
	Date.prototype.toJSON = function () { return {$date: +this}; };

	var s1 = JSON.stringify(o1, function (k, v) {
		//console.log('key:', k, ' \tval:', v);
		if (typeof v === 'function') return {$function: v + ''};
		return v;
	}, '  ');

	if (dateToJSON) Date.prototype.toJSON = dateToJSON;
	else		delete Date.prototype.toJSON;

	console.log(s1);

	console.log(parse(s1));

	function parse(str) {
		return JSON.parse(str, function (k, v) {
			if (typeof v === 'string')
				if (v.match(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z/))
					return new Date(v);
			if (typeof v === 'object' && v) {
				if (v.$function)
					return Function('return ' + v.$function)();
				if (v.$date)
					return new Date(v.$date);
			}
			return v;
		});
	}

})();
