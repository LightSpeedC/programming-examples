	var extend = require('./extend');

	var util = require('util');
	console.log();
	var Animal = extend({
		constructor: function Animal(name) { this.name = name; },
		introduce: function introduce() {
			console.log('My name is', this.name,
				this.constructor.name ? ', one of ' + this.constructor.name : ''); },
	});
	console.log('Animal', util.inspect(Animal));
	console.log('Animal.prototype', Animal.prototype);
	var a = new Animal('Annie');
	console.log('a', a);
	a.introduce();

	console.log();
	var Bear = Animal.extend(
		{constructor: function Bear() { Animal.apply(this, arguments); }});
	console.log('Bear', util.inspect(Bear));
	console.log('Bear.prototype', Bear.prototype);
	var b = new Bear('Bob');
	console.log('b', b);
	b.introduce();

	console.log();
	var Cat = Animal.extend();
	console.log('Cat', util.inspect(Cat));
	console.log('Cat.prototype', Cat.prototype);
	var c = new Cat('Cathy');
	console.log('c', c);
	c.introduce();

	console.log();
	var Class1 = extend({
		constructor: function Class1(name) { this.name = name; },
		introduce: function introduce() {
			console.log('My name is', this.name,
				', one of', this.constructor.name); },
	});
	console.log('Class1', util.inspect(Class1));
	console.log('Class1.prototype', Class1.prototype);
	var c1 = new Class1('Class1');
	console.log('c1', c1);
	c1.introduce();
