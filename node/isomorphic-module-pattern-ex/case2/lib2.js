// lib2.js
!function (factory) {
  //if (typeof define === 'function' && define.amd)
  //  define('lib', [], factory);
  if (typeof module !== 'undefined' && module.exports)
    module.exports = factory();
  else
    this.Lib = factory();
}.call(this, function () {
  'use strict';

  var bar = 'bar';

  function Lib() {
  }

  Lib.prototype.foo = function() {
    return 'foo';
  };

  //Lib.Lib = Lib;
  return Lib;
});
