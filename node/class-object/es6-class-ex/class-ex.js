'use strict';

try { var assert = require('power-assert'); } catch (e) {}
try { var assert = assert || require('assert'); } catch (e) {}
var assert = assert || function assert(val, msg) {
  val || console.log((msg || '') + (new Error).stack);
};

var o1 = {
  name: 'John',
  _age: 5,
  getName() {
    return this.name;
  },
  setName(name) {
    this.name = name;
  },
  sayHello() {
    console.log('Hello, %s, age %d', this.name, this.age);
  },
  get age() {
    return this._age;
  },
  set age(age) {
    this._age = age;
  },
  sayHello2: function sayHello2() {
    this.sayHello();
  }
};

console.log(o1.name, o1.age);
o1.age = 6;
o1.sayHello();
o1.sayHello2();
console.log(o1.sayHello.name);
console.log(o1.sayHello2.name);

class Animal {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  getName() {
    return this.name;
  }
  setName(name) {
    this.name = name;
  }

  get nm() {
    return this.name;
  }

  get age() {
    return this._age;
  }
  set age(age) {
    if (age < 0 || age > 120)
      throw new RangeError('out of range: age ' + age);
    this._age = age;
  }

  static getClassName() {
    return this.name;
  }
  static get nm() {
    return this.name;
  }
}

var a1 = new Animal('a1');
var a2 = new Animal('a2');

console.log(a1.name, a1.nm, a1.getName());
console.log(a2.name, a2.nm, a2.getName());
console.log(Animal.name, Animal.nm, Animal.getClassName());

class Bear extends Animal {
}

var b1 = new Bear('b1');
var b2 = new Bear('b2');

console.log(b1.name, b1.nm, b1.getName());
console.log(b2.name, b2.nm, b2.getName());
console.log(Bear.name, Bear.nm, Bear.getClassName());


assert(a1 instanceof Animal);
assert(a2 instanceof Animal);
assert(b1 instanceof Animal);
assert(b2 instanceof Animal);
assert(b1 instanceof Bear);
assert(b2 instanceof Bear);

assert(Object.getPrototypeOf(a1)               === Animal.prototype);
assert(a1.__proto__                            === Animal.prototype);
assert(Object.getPrototypeOf(Animal.prototype) === Object.prototype);
assert(Animal.prototype.__proto__              === Object.prototype);

assert(Object.getPrototypeOf(Animal)           === Function.prototype);
assert(Animal.__proto__                        === Function.prototype);

assert(Object.getPrototypeOf(b1)               === Bear.prototype);
assert(b1.__proto__                            === Bear.prototype);
assert(Object.getPrototypeOf(Bear.prototype)   === Animal.prototype);
assert(Bear.prototype.__proto__                === Animal.prototype);

assert(Object.getPrototypeOf(Bear)             === Animal);
assert(Bear.__proto__                          === Animal);

//console.log(require('util').inherits + '');

