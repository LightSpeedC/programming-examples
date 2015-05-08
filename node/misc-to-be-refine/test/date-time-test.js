// date-time-test.js

var dt = new Date();
console.log('new Date()');
console.log('          ' + dt);

var DateTime = require('date-time');
var toDateTimeString = DateTime.toDateTimeString;
var toDateString = DateTime.toDateString;
var toTimeString = DateTime.toTimeString;
console.log('toDateTimeString(new Date())');
console.log('          ' + toDateTimeString(dt));
console.log('toDateString(new Date())');
console.log('          ' + toDateString(dt));
console.log('toTimeString(new Date())');
console.log('          ' + toTimeString(dt));
console.log();

DateTime.extendDateToDateTimeString();
console.log('new Date().toDateTimeString()');
console.log('          ' + dt.toDateTimeString());
console.log('new Date().toDateString()');
console.log('          ' + dt.toDateString());
console.log('new Date().toTimeString()');
console.log('          ' + dt.toTimeString());
console.log();

DateTime.extendDateToString();
console.log('new Date().toString()');
console.log('          ' + dt.toString());
console.log('new Date()');
console.log('          ' + dt);
