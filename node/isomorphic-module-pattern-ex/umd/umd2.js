// if the module has no dependencies, the above pattern can be simplified to
!function (factory) {
  'use strict';

   console.log(this);

  if (typeof define === 'function' && define.amd) // AMD
    define('lib', [], factory);
  else if (typeof exports === 'object') // commonjs
    module.exports = factory();
  else // Browser globals
    this.Lib = factory();
}.call(this, function () {
  'use strict';

  var bar = 'bar';

  function Lib() {
  }

  Lib.prototype.foo = function(){
    return 'foo';
  };

  return Lib;
});
