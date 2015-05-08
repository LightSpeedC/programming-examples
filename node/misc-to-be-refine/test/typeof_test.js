/**
 * function typeOf. {型を文字列で返す関数}
 *
 * @param obj JavaScript object
 * @return String type of object
 *
 * @see http://qiita.com/items/465e715dae14e2f601de
 * @see http://bonsaiden.github.io/JavaScript-Garden/ja/#types.typeof
 *
 * function is(type, obj) { return type === typeOf(obj); }
 * function typeOf(obj) { return Object.prototype.toString.call(obj).slice(8, -1); }
 */
function typeOf(obj) { return Object.prototype.toString.call(obj).slice(8, -1); }

function check(o) {
  s = pads(typeof o, 12);
  s += pads(typeOf(o), 12);
  s += pads('(' + o + ')', 20) + ' ';
  if (typeOf(o) === 'Object' || typeOf(o) === 'Array') {
    s += pads(o.constructor.toString().split('(')[0].slice(9, 32), 10);
    //s += o.constructor.toString().slice(9, 32).split('\n')[0];
  }
  console.log(s);
}

function pads(s, n) {
  var r = '';
  var i = 0;
  var len = s.length;

  for (var x = 0; x < len && i < n; ++x) {
    var c = s.charAt(x);
    var code = c.charCodeAt();
    if (code < 0x7F || (code >= 0xFF61 && code <= 0xFF9F)) ++i;
    else i += 2;
    r += c;
  }
  for (; i < n; ++i) r += ' ';
  return r;
}

console.log('\033[1;5m' + pads('typeof', 12) + pads('typeOf', 12) + 
  pads('toString()', 21) + 'Function name \033[m');

check(undefined);
check(null);
check(123);
check(1.2);
check(true);
check(false);
check([]);
check({});
check(new Buffer(0));
check(/ /);
check(JSON);
check(new Date());
check(new Error('err'));
check(Infinity);
check(-Infinity);
check(NaN);

function Person() {}
psn = new Person();
check(psn);

check(Person);
check(global);
check(process);
check(module);
check(exports);

check(require('util'));
check(require('util').inspect);
check(require('http'));
