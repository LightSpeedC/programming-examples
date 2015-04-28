// if the module has no dependencies, the above pattern can be simplified to
(function (root, factory) {
  'use strict';

   console.log(this);

  if (typeof define === 'function' && define.amd) // AMD
    define('lib', [], factory);
  else if (typeof exports === 'object') // commonjs
    module.exports = factory();
  else // Browser globals
    root.Lib = factory();
})(this, function () {
  'use strict';

  var bar = 'bar';

  function Lib() {
  }

  Lib.prototype.foo = function(){
    return 'foo';
  };

  return Lib; // point
});
