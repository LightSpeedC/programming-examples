"use strict";
function Foo() {
  this.greeting = "default";
  Object.seal(this);
}
var foo = new Foo;
console.log("greeting: %s", foo.greeting);
foo.gleeting = "hello";
console.log("gleeting: %s", foo.gleeting);

//$ node sealed.js
//greeting: default
//
//sample.js:8
//foo.gleeting = "hello";
//             ^
//TypeError: Can't add property gleeting, object is not extensible
//    at Object.<anonymous> (sample.js:8:14)
//    at Module._compile (module.js:456:26)
//    at Object.Module._extensions..js (module.js:474:10)
//    at Module.load (module.js:356:32)
//    at Function.Module._load (module.js:312:12)
//    at Function.Module.runMain (module.js:497:10)
//    at startup (node.js:119:16)
//    at node.js:906:3
