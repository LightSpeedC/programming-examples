// aa-promise.js

this.AaPromise = function () {
  'use strict';

  var slice = [].slice;

  AaPromise.wrap = function wrap(fn) {
    return function () {
      var args = slice.call(arguments);
      return AaPromise(function (res, rej) {
        fn.apply(null, args.concat(
          function (err, val) {
            try { if (err) rej(err); else res(val); } catch (e) { rej(e); } }));
      });
    }
  }

  AaPromise.resolve = function resolve(val) {
    if (isPromise(val))
      return AaPromise(function (res, rej) {
        val.then(
          function (v) { res(v); },
          function (e) { rej(e); });
      });
    return AaPromise(function (res, rej) { res(val); });
  };

  AaPromise.reject = function reject(err) {
    return AaPromise(function (res, rej) { rej(err); });
  };

  function isPromise(p) {
    return !!p && typeof p.then === 'function';
  }
  AaPromise.isPromise = isPromise;

  AaPromise.cast = AaPromise.resolve;

  var STATE_UNRESOLVED = -1;
  var STATE_RESOLVED = 1;
  var STATE_REJECTED = 0;
  var STATE_THUNK = 2;
  var ARGS_ERR = 0;
  var ARGS_VAL = 1;
  function AaPromise(setup) {
    var thens = [];
    var state = STATE_UNRESOLVED;
    var args;

    function resolve(val) {
      if (isPromise(val))
        return val.then(function (v) { cb(null, v); }, cb);
      if (typeof val === 'function')
        return val(cb);
      cb(null, val);
    }
    function reject(err)  { cb(err); }

    if (typeof setup === 'function')
      setup(resolve, reject);
    else {
      thunk.$resolve = resolve;
      thunk.$reject  = reject;
    }

    // fire(p, elem)
    function fire(p, elem) {
      if (elem) thens.push(elem);
      if (!args) return p; // not yet fired
      while (elem = thens.shift())
        if (elem[STATE_THUNK]) elem[STATE_THUNK].apply(null, args);
        else if (elem[state]) elem[state](args[state]);
      return p;
    }

    // cb(...args)
    function cb() {
      if (args) return; // already fired
      args = arguments;
      state = args[ARGS_ERR] ? STATE_REJECTED : STATE_RESOLVED;
      fire();
    }

    function thunk(cb) {
      if (typeof cb !== 'function')
        new TypeError('callback must be a function');

      var p = AaPromise();
      return fire(p, [undefined, undefined,
        function (err, val) {
          try {
            if (err) p.$resolve(cb(err));
            else p.$resolve(cb.apply(null, arguments));
          } catch (e) { p.$reject(e); } }
      ]);
    }

    thunk.then = function (res, rej) {
      if (res && typeof res !== 'function')
        new TypeError('resolved must be a function');
      if (rej && typeof rej !== 'function')
        new TypeError('rejected must be a function');

      var p = AaPromise();
      return fire(p, [
        function (err) { try { p.$resolve(rej(err)); } catch (e) { p.$reject(e); } },
        function (val) { try { p.$resolve(res(val)); } catch (e) { p.$reject(e); } }
      ]);
    };

    thunk['catch'] = function (rej) {
      if (rej && typeof rej !== 'function')
        new TypeError('rejected must be a function');

      var p = AaPromise();
      return fire(p, [
        function (err) { try { p.$resolve(rej(err)); } catch (e) { p.$reject(e); } }
      ]);
    };

    thunk.toString = function toString() {
      return 'AaPromise { ' + (
        state === STATE_UNRESOLVED ? '<pending>' :
        state === STATE_RESOLVED ? JSON.stringify(args[ARGS_VAL]) :
        '<rejected> ' + args[ARGS_ERR]) + ' }';
    };

    return thunk;
  }

  if (typeof module === 'object' && module && module.exports)
    module.exports = AaPromise;

  AaPromise.Promise = AaPromise;
  AaPromise.AaPromise = AaPromise;
  return AaPromise;

}();