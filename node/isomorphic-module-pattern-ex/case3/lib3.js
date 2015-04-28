// lib3.js
this.Lib = function factory() {
  'use strict';

  var bar = 'bar';

  function Lib() {
  }

  Lib.prototype.foo = function() {
    return 'foo';
  };

  Lib.Lib = Lib;

  if (typeof define === 'function' && define.amd)
    define('lib', [], factory);
  if (typeof module === 'object' && module.exports)
    module.exports = Lib;
  return Lib;
}();
