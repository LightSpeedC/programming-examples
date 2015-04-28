// main2.js
!function () {
  'use strict';

  var Lib = this.Lib || require('./lib2');

  var lib = new Lib();
  console.log(lib.foo()); // foo
}.call(this);
