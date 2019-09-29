"use strict";
function Foo() {
  this.greeting = "default";
}
var foo = new Foo;
foo.gleeting = "hello";
console.log("greeting: %s", foo.greeting);
console.log("gleeting: %s", foo.gleeting);

//$ node not-sealed.js
//greeting: default
//gleeting: hello
