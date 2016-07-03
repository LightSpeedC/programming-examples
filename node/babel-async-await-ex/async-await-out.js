function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

// http://qiita.com/notsunohito/items/15c528509de8dc5927bf

function sleep(ms) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}

class Human {
  sayHello() {
    var _this = this;

    return _asyncToGenerator(function* () {
      yield sleep(1000);
      console.log('hello');
      return _this;
    })();
  }
  sayBye() {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      yield sleep(1000);
      console.log('bye');
      return _this2;
    })();
  }
}

_asyncToGenerator(function* () {
  yield (yield new Human().sayHello()).sayBye();
})();
// => helloしか出力されない

Promise.all([_asyncToGenerator(function* () {
  yield sleep(3000);
  console.log('x1');
  yield sleep(1000);
  console.log('x2');
})(), _asyncToGenerator(function* () {})()]);

