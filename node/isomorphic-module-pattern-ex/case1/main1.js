// main1.js
(function () {
  'use strict';

  var Lib = this.Lib || require('./lib1').Lib;

  var lib = new Lib();
  console.log(lib.foo()); // foo

}).call(this);
