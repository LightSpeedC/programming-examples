// http://qiita.com/kyoshiro-obj/items/5cd5d59cbe79c245df95

(function () {
  var slice = Array.prototype.slice;

  if (!Function.prototype.bind) {
    Function.prototype.bind = function bind(ctx) {
      if (typeof this !== 'function')
        throw TypeError();

      var fn = this;
      var args = slice.call(arguments, 1);
      return function () {
        return fn.apply(ctx, args.concat(slice.call(arguments)));
      };
    };
  }
})();
