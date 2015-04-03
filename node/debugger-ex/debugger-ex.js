// debugger-ex.js

// $ node debug debugger-ex.js

var x = 10;

setInterval(function() {
  // 止めたい箇所にdebuggerと入れる
  debugger;
  x++;
  console.log(x);
}, 100);
