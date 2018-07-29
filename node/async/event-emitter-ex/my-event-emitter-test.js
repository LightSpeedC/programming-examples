'use strict';

// my-event-emitter-test

const MyEventEmitter = require('./my-event-emitter');


// class MyClass extends EventEmitter {};
class MyClass extends MyEventEmitter {};
// MyEventEmitter.mixin(MyClass);

// var ee = new EventEmitter();
var ee = new MyClass();
ee.on('eventx', (arg1, arg2) => console.log('eventx', arg1, arg2));
ee.emit('eventx', 11, 12);
ee.emit('eventx', 21, 22);
ee.one('event1', (arg1, arg2) => console.log('event1', arg1, arg2));
ee.emit('event1', 11, 12);
ee.emit('event1', 21, 22);
ee.off('eventx');
ee.emit('eventx', 31, 32);



const ee2 = new MyEventEmitter();

ee2.on('ev1', (...args) => console.log(args));
ee2.emit('ev1', 'ev1', 1, 2);

