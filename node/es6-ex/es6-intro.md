ES6 入門
====

ES6実装状況
http://kangax.github.io/compat-table/es6/

Slide
http://yoshiko-pg.github.io/slides/20150425-jsfes/

Slide
http://www.slideshare.net/t32k/javascriptcss-2015-autumn
	see p19

他の人に勧められる技術かどうか

+ その技術は既に標準なのか? ES6は標準になったばかりだ。
+ それは広く普及しているのか? ES6はこれからだね。
+ それは問題を解決するのか? 他に簡単な方法が無いのか?
+ 代替案はあるけど、それよりも解決方法が優れているよね。
+ ただ見映えがいい? 格好いい?
+ 文字数がちょっと少なくなる?
+ 自慢したいだけじゃないよね?
+ それを使う事のメリットとデメリットは?
+ デメリットを大幅に上回るメリットがあるのか?

ECMAScript history

+ 1999 ES3
+ 2008 ES4 Abandoned
+ 2009 ES5
+ 2015 ES6

Babel ES6 を ES5 に変換

|技術             |標準|普及|解決度合|見映え|備考           |
|:----------------|:--:|:--:|:------:|:----:|:--------------|
|ES6 (ES2015)     | ◎ | △ | ○     | ○   | 2015.6 標準化 |
|generators/yield | ◎ | ○ | ◎     | ◎   |               |

Syntax
====

## デフォルト引数 default function parameters

## 可変長引数 rest parameters

配列を展開して引数に渡す

## spread (...) operator

## object literal extensions オブジェクトリテラル簡略化

```js
var p = {name: name, age: age,
	hi: function () { return 'hi'; }};
var p = {name, age,
	hi() { return 'hi'; }};
```

## for..of loops (iterators イテレータ)

## octal and binary literals 8進数2進数リテラル

## template strings テンプレート文字列 - 文字列内で変数を展開 `${x} `

## RegExp "y" and "u" flags

## Unicode code point escapes

## new.target



Bindings
====

## const, let

## block-level function declaration


Functions
====

## arrow functions アロー記法と、thisの扱い

## class クラスと継承

## super

## generators

Build-ins
====

## typed arrays

## Map, Set

## WeakMap, WeakSet

## Proxy

## Reflect

## Promise

## シンボル Symbol

## well-known symbols

Build-in extensions
====

## Object static methods

## function "name" property

## String static methods

## String.prototype methods

## RegExp.prototype properties

## Array static methods

## Array.prototype methods

## Number properties

## Math methods

Subclassing
====

## Array is subclassable

## RegExp is subclassable

## Function is subclassable

## Promise is subclassable

## miscellaneous subclassables


Misc
====

## prototype of bouond functions

## Proxy, internal 'get' calls

## Proxy, internal 'set' calls

## Proxy, internal 'defineProperty' calls

## Proxy, internal 'deleteProperty' calls

## Proxy, internal 'getOwnPropertyDescriptor' calls

## Proxy, internal 'ownKeys' calls

## Object static methods accept primitives

## own property order

## miscellaneous


Annex b
====

## non-strict function semantics

## __proto__ in object literals

## Object.prototype.__proto__

## String.prototype HTML methods

## RegExp.prototype.compile

## RegExp syntax extensions

## HTML-style comments



???
====

## keyで演算を使用

## メソッドの記述を簡略化

## destructuring 分割代入 分配束縛 デストラクチャリング

## モジュール Modules & Module loaders

## Array comprehensions
