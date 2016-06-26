true.prop1 = 'abc';
console.log(true.prop1);
//ってどういう意味なのか。
//その辺りに答えが隠されている様に思える。
//答えはundefinedだ。一時的に作られたオブジェクトの属性(プロパティ)など保時されないのだ。

t = Boolean(true);
t.prop1 = 'abc';
console.log(t, t.prop1);
//は同じくtrue undefinedになる。

o = new Boolean(true);
o.prop1 = 'abc';
console.log(o + ' ' + o.prop1);
//は同じくtrue abcになる。


n = new Number(123);
console.log(n !== 123); // -> true
console.log(n == 123); // -> true

b = new Boolean(true);
console.log(b !== true); // -> true
console.log(b == true); // -> true
console.log(b !== 1); // -> true
console.log(b == 1); // -> true
console.log(b.valueOf() !== 1); // -> true
console.log(b.valueOf() === true); // -> true

s = new String('str');
console.log(s !== 'str'); // -> true
console.log(s == 'str'); // -> true
