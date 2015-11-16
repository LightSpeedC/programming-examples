void function() {
	'use strict';

	var statistics = {};

	function bench(count, name, func) {
		statistics[name] = statistics[name] || {count: 0, total: 0, min:Infinity, max:-Infinity};

		// warm up
		for (var i = 0; i < 1e6; ++i)
			func();

		// start
		var hrtime1 = process.hrtime();

		// benchmark
		for (var i = 0; i < 1e7; ++i)
			func();

		// end
		var hrtime2 = process.hrtime();

		var nsec = ((hrtime2[0] - hrtime1[0]) * 1e9 + hrtime2[1] - hrtime1[1]);

		process.stdout.write(name + ('        ' + (nsec/1e6).toFixed(6)).substr(-10,10) + 'ms  ');

		// statistics
		statistics[name].count++;
		statistics[name].total += nsec;
		if (statistics[name].min > nsec) statistics[name].min = nsec;
		if (statistics[name].max < nsec) statistics[name].max = nsec;
	}

	var marks = [
		{name: 'a1', func: function () {
			var obj = {x:0,y:0};
			obj.x = 10;
			obj.y = 20;
			return obj.x + obj.y;
		}},
		{name: 'b1', func: function () {
			var obj = {x:0,y:0};
			obj.x = 10 | 0;
			obj.y = 20 | 0;
			return obj.x + obj.y;
		}},
		{name: 'c1', func: function () {
			var obj = {x:0};
			obj.x = 10 | 0;
			obj.x |= (20 << 16);
			return (obj.x & 0xffff) + (obj.y >> 16);
		}},
		{name: 'd1', func: function () {
			function Class() {
				this.x = 0;
				this.y = 0;
			}
			return function () {
				var obj = new Class;
				obj.x = 10;
				obj.y = 20;
				return obj.x + obj.y;
			}
		}()},

	];

	for (var i = 0; i < 20; ++i) {
		marks.forEach(x=>bench(i, x.name, x.func));
		process.stdout.write('\n');
	}
	marks.forEach(x=>process.stdout.write(x.name + ': ' + statistics[x.name].min + '  '));
	process.stdout.write('\n');
	marks.forEach(x=>process.stdout.write(x.name + ': ' + statistics[x.name].max + '  '));
	process.stdout.write('\n');
	marks.forEach(x=>process.stdout.write(x.name + ': ' +
		statistics[x.name].total/statistics[x.name].count + '  '));
	process.stdout.write('\n');
}();
