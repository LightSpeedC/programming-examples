this['extend-light'] = function () {
  'use strict';

  // merge-light
  function merge(dst, src) {
    for (var i = 1; src = arguments[i], i < arguments.length; ++i)
      for (var p in src)
        if (src.hasOwnProperty(p) && !dst.hasOwnProperty(p) &&
            dst[p] !== src[p]) dst[p] = src[p];
    return dst;
  }

  var setProto = Object.setPrototypeOf ||
      ({}.__proto__ = {proto:1}).proto &&
      function setProto(obj, proto) { obj.__proto__ = proto; } || null;

  function extend(proto, statics) {
    'use strict';
    proto = proto || {};
    var super_ = typeof this === 'function' ? this : undefined;

    var ctor = proto.hasOwnProperty('constructor') ? proto.constructor :
      super_ ? function () {
        if (!(this instanceof ctor)) return ctor.apply(new $ctor(), arguments);
        super_.apply(this, arguments); return this; } :
      function () { if (!(this instanceof ctor)) return new ctor(); };
 
    function $super() { this.constructor = ctor; }
    if (super_) $super.prototype = super_.prototype;
    function $ctor() {}
    $ctor.prototype = ctor.prototype = merge(new $super(), proto);
    delete ctor.prototype.statics;

    if (super_ && setProto) setProto(ctor, super_);
    return merge(ctor, proto.statics, statics,
      super_ ? {super_: super_} : undefined, super_, {extend: extend, create: create});
  }

  function create() {
    function $ctor() {}
    $ctor.prototype = this.prototype;
    return this.apply(new $ctor(), arguments);
  }

  if (typeof module === 'object' && module && module.exports)
    module.exports = extend;

  return extend;
}();
