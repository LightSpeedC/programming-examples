(function () {
  'use strict';

    var co = require('co');

    function *makeErr() {
      throw new Error('err in makeErr');
    }

    co(function *() {
      yield makeErr();
    }).then(
      function (val) { console.log('co1 end:', val); },
      function (err) { console.log('co1 err:', err); });

    function timerErrThunk() {
      return function (cb) {
        setTimeout(function () {
          try {
            new Error('err in timerErrThunk');
          } catch (err) {
            cb(err);
          }
          cb(null);
        }, 100);
      }
    }

    function timerErrPromise() {
      return new Promise(function (res, rej) {
        setTimeout(function () {
          try {
            new Error('err in timerErrPromise');
          } catch (err) {
            rej(err);
          }
          res();
        }, 200);
      });
    }

    co(function *() {
      yield timerErrThunk();
    }).then(
      function (val) { console.log('co2 end:', val); },
      function (err) { console.log('co2 err:', err); });

    co(function *() {
      yield timerErrPromise();
    }).then(
      function (val) { console.log('co3 end:', val); },
      function (err) { console.log('co3 err:', err); });


})();
