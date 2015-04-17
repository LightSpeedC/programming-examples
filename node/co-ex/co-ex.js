(function () {
  'use strict';

    var co = require('co');

    function sleep(ms) {
      return function (cb) {
        setTimeout(function () { cb(null); }, ms); }; }

    function *makeErr() {
      console.log(111);
      yield sleep(10);
      console.log(222);
      yield sleep(10);
      console.log(333);
      throw new Error('err in makeErr');
    }

    co(function *() {
      yield *makeErr();
    }).then(
      function (val) { console.log('co1 end:', val); },
      function (err) { console.log('co1 err:', err); });
    // -> co1 err: [Error: err in makeErr]

    function timerErrThunk(ms) {
      return function (cb) {
        setTimeout(function () {
          try {
            throw new Error('err in timerErrThunk');
          } catch (err) {
            cb(err);
          }
          cb(null);
        }, ms);
      }
    }

    co(function *() {
      yield timerErrThunk(100);
    }).then(
      function (val) { console.log('co2 end:', val); },
      function (err) { console.log('co2 err:', err); });
    // -> co2 err: [Error: err in timerErrThunk]

    function timerErrPromise(ms) {
      return new Promise(function (res, rej) {
        setTimeout(function () {
          try {
            throw new Error('err in timerErrPromise');
          } catch (err) {
            rej(err);
          }
          res();
        }, ms);
      });
    }

    co(function *() {
      yield timerErrPromise(200);
    }).then(
      function (val) { console.log('co3 end:', val); },
      function (err) { console.log('co3 err:', err); });
    // -> co3 err: [Error: err in timerErrPromise]

})();
