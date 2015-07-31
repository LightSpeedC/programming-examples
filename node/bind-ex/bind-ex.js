	function x1() {
		console.log('type:%s %s', typeof this, this ? 'constructor:' + this.constructor.name : '');
	}

	x1();

	var x2 = x1.bind([]);
	x2();

	var x3 = x2.bind(new Error);
	x3();


	function y1() {
		'use strict';
		console.log('type:%s %s', typeof this, this ? 'constructor:' + this.constructor.name : '');
	}

	y1();

	var y2 = y1.bind([]);
	y2();

	var y3 = y2.bind(new Error);
	y3();
