  // http://qiita.com/okunishinishi@github/items/d6f3cffa58ef480c4af7

  function doSomething() {
    var cb = typeof arguments[arguments.length - 1] === 'function' ?
          arguments[--arguments.length] : null;

    var arr = arguments[arguments.length - 1] instanceof Array ?
          arguments[--arguments.length] : [];

    var opt = typeof arguments[arguments.length - 1] === 'object' ?
          arguments[--arguments.length] : {};

    var args = [].slice.call(arguments);

    console.log('args:', args, opt, arr, cb ? typeof cb : '-');
  }

  doSomething();
  doSomething(cb);
  doSomething({opt: 'option'});
  doSomething({opt: 'option'}, cb);
  doSomething([1,2]);
  doSomething([1,2], cb);
  doSomething({opt: 'option'}, [1,2]);
  doSomething({opt: 'option'}, [1,2], cb);

  doSomething('aa');
  doSomething('aa', cb);
  doSomething('aa', {opt: 'option'});
  doSomething('aa', {opt: 'option'}, cb);
  doSomething('aa', [1,2]);
  doSomething('aa', [1,2], cb);
  doSomething('aa', {opt: 'option'}, [1,2]);
  doSomething('aa', {opt: 'option'}, [1,2], cb);

  doSomething('aa', 'bb');
  doSomething('aa', 'bb', cb);
  doSomething('aa', 'bb', {opt: 'option'});
  doSomething('aa', 'bb', {opt: 'option'}, cb);
  doSomething('aa', 'bb', [1,2]);
  doSomething('aa', 'bb', [1,2], cb);
  doSomething('aa', 'bb', {opt: 'option'}, [1,2]);
  doSomething('aa', 'bb', {opt: 'option'}, [1,2], cb);

  doSomething('aa', 'bb', 'cc');
  doSomething('aa', 'bb', 'cc', cb);
  doSomething('aa', 'bb', 'cc', {opt: 'option'});
  doSomething('aa', 'bb', 'cc', {opt: 'option'}, cb);
  doSomething('aa', 'bb', 'cc', [1,2]);
  doSomething('aa', 'bb', 'cc', [1,2], cb);
  doSomething('aa', 'bb', 'cc', {opt: 'option'}, [1,2]);
  doSomething('aa', 'bb', 'cc', {opt: 'option'}, [1,2], cb);

  doSomething('foo')
  doSomething('foo','bar')
  doSomething('foo','bar', 'baz');
  doSomething('foo','bar', {verbose:true});
  doSomething('foo','bar', function done(){/*...*/})
  doSomething('foo','bar', {verbose:true}, function done(){/*...*/})

  function cb() {}
