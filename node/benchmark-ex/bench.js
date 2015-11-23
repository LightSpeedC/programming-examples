function Suite() {
	this.tests = [];
	var self = this;
	setImmediate(function () { self.run(); });
}
Suite.prototype.add = add;
function add(name, test) {
	this.tests.push({name:name, test:test});
	return this;
}
Suite.prototype.run = run;
function run() {
	this.tests.forEach(function (test) {
		var time1 = Date.now(), time2 = time1;
		var time3 = time1 + 1000;
		var i = 0;
		while (time2 < time3) {
			i++;
			test.test();
			time2 = Date.now();
		}
		console.log('', i / (time2 - time1) * 1000, 'op/sec', test.name);
	});
}
benchmark({Suite: Suite});

function benchmark(Benchmark) {
	var arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
	return new Benchmark.Suite()
		.add('Array#slice', function () {
			arr.slice();
		})
		.add('Array#concat', function () {
			arr.concat();
		})
		.add('for reverse loop', function () {
			var arr2 = [];
			for (var i = arr.length - 1; i >= 0; i--) {
				arr2[i] = arr[i];
			}
		})
		.add('for loop', function () {
			var arr2 = [];
			for (var i = 0; i < arr.length; i++) {
				arr2[i] = arr[i];
			}
		})
		.add('for loop2', function () {
			var arr2 = Array(arr.length);
			for (var i = 0; i < arr.length; i++) {
				arr2[i] = arr[i];
			}
		})
		.add('Array.apply', function () {
			Array.apply(null, arr);
		})
		.add('push', function () {
			var arr2 = [];
			[].push.apply(arr2, arr);
		})
		.add('polyfill', function () {
			clone(arr);
		});

	function clone(arr) {
		var arr2 = [];
		for (var i = 0; i < arr.length; ++i) {
			arr2[i] = arr[i];
		}
		return arr2;
	}
}
