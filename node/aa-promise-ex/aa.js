// aa.js - async-await.js

this.aa = function () {
  var AaPromise = require('./aa-promise');
  var isPromise = AaPromise.isPromise;
  var wrap = AaPromise.wrap;

  // GeneratorFunction
  try {
    var GeneratorFunction = Function('return function*(){}')().constructor;
  } catch (e) {}

  var slice = [].slice;

  // aa
  function aa(gtor) {
    var ctx = this;
    var args = slice.call(arguments, 1);
    if (isGeneratorFunction(gtor)) gtor = gtor.apply(ctx, args);
    if (typeof gtor === 'function') return wrap.call(ctx, gtor);

    var p = AaPromise();

    if (isPromise(gtor)) {
      gtor.then(p.$resolve, p.$reject);
      return p;
    }
    if (!isGenerator(gtor))
      throw new TypeError('arguments must be Generator or GeneratorFunction');

    function next(err, val) {
      //console.log('\x1b[43merr&val', typeof err, err+'', typeof val, '\x1b[m');
      try {
        if (err) var ret = gtor['throw'](err);
        else     var ret = gtor.next(val);
      } catch (err) {
        return p.$reject(err);
      }

      //console.log('\x1b[44m    ret', typeof ret,
      //  '{done:',  ret && ret.done,
      //  'value:', (ret && ret.value &&
      //             ret.value.hasOwnProperty('toString') && ret.value + '') ||
      //            (ret && ret.value &&
      //             typeof ret.value === 'function' && 'function') + '}', '\x1b[m');
      if (ret.done)
        return p.$resolve(ret.value);

      doValue(ret.value, next);
    }

    function doValue(value, next) {
      setImmediate(function () {
        var called;

        // generator function, generator or promise
        if (isGeneratorFunction(value) ||
            isGenerator(value) || isPromise(value))
          aa(value)(next);
        // function must be a thunk
        else if (typeof value === 'function') {
          if (ret != null) console.log('###', ret);
          var ret = value.call(ctx, function (e, v) {
            if (ret != null && e != null && v != null)
              console.log('@@@', ret, e, v);
            if (ret == null) return next(e, v);
            if (e) return next(e, v);
            if (isGeneratorFunction(ret) ||
                isGenerator(ret) || isPromise(ret))
              return aa(ret)(next);
            return next(e, v);
          });
        }
        // array
        else if (value instanceof Array) {
          var n = value.length;
          var arr = Array(value.length);
          value.forEach(function (val, i) {
            doValue(val, function (err, val) {
              if (err) return next(err, arr), called = true;
              arr[i] = val;
              if (--n === 0 && !called)
                next(null, arr), called = true;
            });
          });
        }
        // object
        else if (value && typeof value === 'object') {
          var keys = Object.keys(value);
          var n = keys.length;
          var obj = {};
          keys.forEach(function (key) {
            obj[key] = void 0;
            doValue(value[key], function (err, val) {
              if (err) return next(err, obj), called = true;
              obj[key] = val;
              if (--n === 0 && !called)
                next(null, obj), called = true;
            });
          });
        }
        else // other value
          next(null, value);
      });
    }

    next(null);

    return p;
  }

  // isGeneratorFunction
  function isGeneratorFunction(gtor) {
    return !!gtor && gtor instanceof GeneratorFunction;
  }

  // isGenerator
  function isGenerator(gtor) {
    return !!gtor && typeof gtor.next === 'function';
  }

  if (typeof module === 'object' && module && module.exports)
    module.exports = aa;

  if (GeneratorFunction)
    aa.GeneratorFunction = GeneratorFunction;
  aa.isGeneratorFunction = isGeneratorFunction;
  aa.isGenerator = isGenerator;
  aa.aa = aa;
  for (var i in AaPromise)
    aa[i] = AaPromise[i];
  return aa;

}();
