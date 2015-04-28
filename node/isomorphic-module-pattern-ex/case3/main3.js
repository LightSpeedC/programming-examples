// main3.js
(function (Lib) {
  'use strict';

  var lib = new Lib();
  console.log(lib.foo()); // foo

})(this.Lib || require('./lib3'));
