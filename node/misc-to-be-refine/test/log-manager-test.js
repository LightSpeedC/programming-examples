// log-manager-test.js

'use strict';

var LogManager = require('log-manager');

LogManagerTest_test();

function LogManagerTest_test() {
  var log = LogManager.getLogger();
  log.trace('test trace %s %d', 'arg1', 2);
  log.debug('test debug %s %d', 'arg1', 2);
  log.info('test info  %s %d', 'arg1', 2);
  log.warn('test warn  %s %d', 'arg1', 2);
  log.error('test error %s %d', 'arg1', 2);
  log.fatal('test fatal %s %d', 'arg1', 2);

  LogManager.setLevel('FATAL');
  LogManager.setLevel('ERROR');
  LogManager.setLevel('WARN');
  LogManager.setLevel('INFO');
  LogManager.setLevel('DEBUG');
  LogManager.setLevel('TRACE');

  log.trace('test trace %s %d', 'arg1', 2);
  log.debug('test debug %s %d', 'arg1', 2);
  log.info('test info  %s %d', 'arg1', 2);
  log.warn('test warn  %s %d', 'arg1', 2);
  log.error('test error %s %d', 'arg1', 2);
  log.fatal('test fatal %s %d', 'arg1', 2);

  LogManager.setLevel(5);
  LogManager.setLevel(4);
  LogManager.setLevel(3);
  LogManager.setLevel(2);
  LogManager.setLevel(1);
  LogManager.setLevel(0);

  log.trace('test trace %s %d', 'arg1', 2);
  log.debug('test debug %s %d', 'arg1', 2);
  log.info('test info  %s %d', 'arg1', 2);
  log.warn('test warn  %s %d', 'arg1', 2);
  log.error('test error %s %d', 'arg1', 2);
  log.fatal('test fatal %s %d', 'arg1', 2);

  log.info();
  log.info('test info - no args');
  log.info('test info - 1 - %s', 'arg1');
  log.info('test info - 2 - %s %d', 'arg1', 2);
  log.info('test info - 1 -', 'arg1');
  log.info('test info - 2 -', 'arg1', 2);
  log.info(123);
  log.info({x:1, y:2});

  var log = LogManager.getLogger('className1');
  log.trace('test trace %s %d', 'arg1', 2);
  log.debug('test debug %s %d', 'arg1', 2);
  log.info('test info  %s %d', 'arg1', 2);
  log.warn('test warn  %s %d', 'arg1', 2);
  log.error('test error %s %d', 'arg1', 2);
  log.fatal('test fatal %s %d', 'arg1', 2);
}

process.nextTick(function LogManagerTest_onNextTick() {
  var log = LogManager.getLogger();
  log.trace('test trace %s %d', 'arg1', 2);
  log.debug('test debug %s %d', 'arg1', 2);
  log.info('test info  %s %d', 'arg1', 2);
  log.warn('test warn  %s %d', 'arg1', 2);
  log.error('test error %s %d', 'arg1', 2);
  log.fatal('test fatal %s %d', 'arg1', 2);
});

setTimeout(function LogManagerTest_onTimeout() {
  var log = LogManager.getLogger();
  log.trace('test trace %s %d', 'arg1', 2);
  log.debug('test debug %s %d', 'arg1', 2);
  log.info('test info  %s %d', 'arg1', 2);
  log.warn('test warn  %s %d', 'arg1', 2);
  log.error('test error %s %d', 'arg1', 2);
  log.fatal('test fatal %s %d', 'arg1', 2);


  var mgr = new LogManager().setLevel('WARN');
  var log = mgr.getLogger('mgr2');

  log.trace('test trace %s %d', 'arg1', 2);
  log.debug('test debug %s %d', 'arg1', 2);
  log.info('test info  %s %d', 'arg1', 2);
  log.warn('test warn  %s %d', 'arg1', 2);
  log.error('test error %s %d', 'arg1', 2);
  log.fatal('test fatal %s %d', 'arg1', 2);


  var log = new LogManager().setLevel('DEBUG').getLogger('mgr3');

  log.trace('test trace %s %d', 'arg1', 2);
  log.debug('test debug %s %d', 'arg1', 2);
  log.info('test info  %s %d', 'arg1', 2);
  log.warn('test warn  %s %d', 'arg1', 2);
  log.error('test error %s %d', 'arg1', 2);
  log.fatal('test fatal %s %d', 'arg1', 2);


  var log = new LogManager().getLogger('mgr4').setLevel('ERROR');

  log.trace('test trace %s %d', 'arg1', 2);
  log.debug('test debug %s %d', 'arg1', 2);
  log.info('test info  %s %d', 'arg1', 2);
  log.warn('test warn  %s %d', 'arg1', 2);
  log.error('test error %s %d', 'arg1', 2);
  log.fatal('test fatal %s %d', 'arg1', 2);

  var LogWriter = require('log-writer');
  LogManager.setWriter(new LogWriter('log-manager-test-%s.log'));
  var log = LogManager.getLogger();
  log.trace('test trace %s %d', 'arg1', 2);
  log.debug('test debug %s %d', 'arg1', 2);
  log.info('test info  %s %d', 'arg1', 2);
  log.warn('test warn  %s %d', 'arg1', 2);
  log.error('test error %s %d', 'arg1', 2);
  log.fatal('test fatal %s %d', 'arg1', 2);
}, 100);
