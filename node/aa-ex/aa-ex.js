(function () {
  'use strict';

    var aa = require('aa');

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

    aa(function *() {
      yield makeErr();
    }).then(
      function (val) { console.log('aa1 end:', val); },
      function (err) { console.log('aa1 err:', err); });

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

    aa(function *() {
      yield timerErrThunk(100);
    }).then(
      function (val) { console.log('aa2 end:', val); },
      function (err) { console.log('aa2 err:', err); });

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

    aa(function *() {
      yield timerErrPromise(200);
    }).then(
      function (val) { console.log('aa3 end:', val); },
      function (err) { console.log('aa3 err:', err); });

    timerErrPromise(300).then(
      function (val) { console.log('pr1 end:', val); },
      function (err) { console.log('pr1 err:', err); });

})();
