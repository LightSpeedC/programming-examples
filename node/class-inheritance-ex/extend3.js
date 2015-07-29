var extend = this.extend = function () {
  'use strict';

  function merge(dst, src) {
    for (var i = 1, n = arguments.length; i < n; ++i) {
      src = arguments[i];
      for (var j in src) {
        if (src.hasOwnProperty(j) && !dst.hasOwnProperty(j) &&
            dst[j] !== src[j]) dst[j] = src[j];
      }
    }
    return dst;
  }

  function extend(proto, statics) {
    'use strict';
    proto = proto || {};
    var _super = typeof this === 'function' ? this : Object;

    var ctor = proto.hasOwnProperty('constructor') ?
      proto.constructor :
      function () { _super.apply(this, arguments); };

    function __() { this.constructor = ctor; }
    __.prototype = _super.prototype;
    ctor.prototype = new __();

    merge(ctor.prototype, proto);

    if (_super !== Object) {
      ctor.super_ = _super;
      if (ctor.__proto__) ctor.__proto__ = _super;
      merge(ctor, _super);
    }
    merge(ctor, proto.statics, statics, {extend:extend});
    return ctor;
  }

  return extend;
}();

  var util = require('util');
  var Animal = extend({
    constructor: function Animal(name) { this.name = name; },
    introduce: function introduce() {
      console.log('My name is', this.name,
                  ', one of', this.constructor.name); },
  });
  console.log('Animal', util.inspect(Animal));
  console.log('Animal.prototype', Animal.prototype);
  var a = new Animal('Annie');
  console.log('a', a);
  a.introduce();
