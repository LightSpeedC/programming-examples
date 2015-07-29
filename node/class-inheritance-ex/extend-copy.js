  function extend(statics) {
    var superCtor = typeof this === 'function' ? this : Object;
    var ctor = statics.constructor;
    if (ctor === Object) {
      ctor = statics.constructor = function () {
        superCtor.call(this);
      };
    }
    function __(ctor) { this.constructor = ctor; }
    __.prototype = superCtor.prototype;
    ctor.prototype = new __(ctor);
    ctor.extend = extend;
    for (var k in statics) {
      if (k.charAt(0) == '$')
        ctor[k.substring(1)] = statics[k];
      else
        ctor.prototype[k] = statics[k]; 
        // ↑constructorも上書き
    }
    if (typeof ctor.constructor === "function")
      ctor.constructor();
    return ctor;
  }

  function extend(proto, statics) {
    'use strict';
    proto = proto || {};
    var _super = typeof this === 'function' ? this : Object;
    var ctor = proto.hasOwnProperty('constructor') ? proto.constructor :
      function () { _super.apply(this, arguments); };
    function __() { this.constructor = ctor; }
    __.prototype = _super.prototype;
    ctor.prototype = new __();
    for (var p in proto) if (proto.hasOwnProperty(p)) ctor.prototype[p] = proto[p];
    for (var p in _super) if (_super.hasOwnProperty(p)) ctor[p] = _super[p];
    if (statics)
      for (var p in statics) if (statics.hasOwnProperty(p)) ctor[p] = statics[p];
    if (!('extend' in ctor)) ctor.extend = extend;
    ctor.super_ = _super;
    if (_super !== Object && ctor.__proto__) ctor.__proto__ = _super;
    return ctor;
  }
