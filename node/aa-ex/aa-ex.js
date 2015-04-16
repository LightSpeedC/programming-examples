(function () {
  'use strict';

    var aa = require('aa');

    function *makeErr() {
      throw new Error('err in makeErr');
    }

    aa(function *() {
      yield makeErr();
    }).then(
      function (val) { console.log('aa1 end:', val); },
      function (err) { console.log('aa1 err:', err); });

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

    aa(function *() {
      yield timerErrThunk();
    }).then(
      function (val) { console.log('aa2 end:', val); },
      function (err) { console.log('aa2 err:', err); });

    aa(function *() {
      yield timerErrPromise();
    }).then(
      function (val) { console.log('aa3 end:', val); },
      function (err) { console.log('aa3 err:', err); });


})();
