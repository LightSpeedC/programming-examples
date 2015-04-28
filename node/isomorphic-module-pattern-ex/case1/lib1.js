// lib1.js
this.Lib = function () {
  'use strict';

  var bar = 'bar';

  function Lib() {
  }

  Lib.prototype.foo = function() {
    return 'foo';
  };

  return Lib;
}();
