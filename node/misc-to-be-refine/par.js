/* par.js */

'use strict';

/*
Usage: {使用方法:}

  var Par = require('par');

  //  callback(err, results)
  //  or callback = new Par(...);
  //  or callback = {'selector': function (err, results) {} };

  var par = new Par(number, callback);

  par.done(result); or par.done(result, key);
  par.fail(err);    or par.fail(err, key);

    var par = new Par(2,
          function (err, results) { console.log(err, results); });
    par.done('res1'); par.done('res2');

  var par = new Par(tasks, callback);

  par.fork();

    var par = new Par(
          [function (callback) { callback(null, result1); },
           function (callback) { callback(null, result2); }],
          function (err, results) { console.log(err, results); } );
    par.fork();

    var par = new Par(
          [function (callback) { callback(null, result1, key1); },
           function (callback) { callback(null, result2, key2); }],
          function (err, results) { console.log(err, results); } );
    par.fork();

*/

/**
 * internal array of Par class instances for dump.
 * {内部Parクラスインスタンス配列(ダンプ用)}
 */
var _pars = [];

/**
 * class: Par
 * {Parクラス}
 *
 * @param number done count to callback
 * @param callback function
 */
function Par(tasks, callback) {
  this.id = _pars.length;

  if (arguments.length !== 2)
    throw new Error('Specify 2 arguments (Par)');

  if (typeof tasks === 'object' && tasks.constructor.name === 'Array') {
    // this.length = tasks.length;
    this.count = tasks.length;
    this.tasks = tasks;
  }
  else if (typeof tasks === 'number') {
    // this.length = tasks;
    this.count = tasks;
    this.tasks = null;
  }
  else
    throw new Error('Argument 1 is not number or array of tasks (Par)');

  if (typeof callback !== 'function' && typeof callback !== 'object')
    throw new Error('Argument 2 callback is not function or object (Par)');

  this.callback = callback;

  this.selector = null;
  if (typeof callback === 'object' && ! (callback instanceof Par))
    this.selector = Object.keys(callback)[0];

  this.err = null;
  this.results = [];

  _pars.push(this);

  return this;
}

/**
 * class: Par
 * method: finish
 * @param err object of Error
 * @param results array of results
 * @returns this
 */
Par.prototype.finish = function Par_finish(err, results) {
  if (! err && results !== null && typeof results === 'object') {
    for (var i in results) {
      if (results[i] instanceof Error) {
        err = results[i];
        break;
      }
    }
  }
  if (typeof this.callback === 'function')
    this.callback(err, results);
  else if (! (this.callback instanceof Par))
    this.callback[this.selector](err, results);
  else if (err)
    this.callback.fail(err);
  else
    this.callback.done(results);

  delete _pars[this.id];
  while (_pars.length > 0 && typeof _pars[_pars.length - 1] === 'undefined')
    _pars.pop();

  return this;
}

/**
 * class: Par
 * method: done
 * @param result object
 * @param key (optional) key of results array
 * @returns this
 */
Par.prototype.done = function Par_done(result, key) {
  if (this.tasks !== null)
    throw new Error('Tasks must be number (Par.done)');

  // console.log('done:', result, key);
  this.results.push(result);
  if (key) this.results[key] = result;
  if (this.count > 0) {
    --this.count;
    if (this.err === null && this.count === 0)
      this.finish(null, this.results);
  }
  return this;
}

/**
 * class: Par
 * method: fail
 * @param err object of Error
 * @param key (optional) key of results array
 * @returns this
 */
Par.prototype.fail = function Par_fail(err, key) {
  if (this.tasks !== null)
    throw new Error('Tasks must be number (Par.fail)');

  // console.log('fail:', err, key);
  if (key) this.results[key] = err;
  if (this.err === null) {
    this.err = err;
    this.finish(err, this.results);
  }
  return this;
}

/**
 * class: Par
 * method: extend
 * @returns this
 */
Par.prototype.extend = function Par_extend() {
  if (this.tasks !== null)
    throw new Error('Tasks must be number (Par.extend)');

  ++this.count;
  return this;
}

/**
 * class: Par
 * method: fork
 */
Par.prototype.fork = function Par_fork() {
  if (this.tasks === null)
    throw new Error('Tasks must be array of callback functions (Par.fork)');

  for (var i in this.tasks) {
    var callback = (function Par_fork_getCallback(that, i) {
      return function Par_fork_callback(err, result, key) {
        that.results[i] = result;
        if (key) that.results[key] = result;
        if (that.count > 0) {
          --that.count;
          if (that.err === null && (err || that.count === 0)) {
            that.err = err;
            that.finish(err, that.results);
          }
        }
      };
    })(this, i);
    nextTick((function Par_fork_getNextTick(that, task, callback) {
      return function Par_fork_nextTick() {
        task.call(that, callback);
      };
    })(this, this.tasks[i], callback));
  }
  return this;
}

/**
 * class: Par
 * method: select
 * @param selector key of array or object
 * @returns this
 */
Par.prototype.select = function Par_select(selector) {
  if (this.callback === null || typeof this.callback !== 'object')
    throw new Error('Callback must be object (Par.select)');

  if (this.callback instanceof Par)
    throw new Error('Callback must not be Par class object (Par.select)');

  if (! (selector in this.callback))
    throw new Error('Callback must have selector key: ' + selector + ' (Par.select)');

  this.selector = selector;

  return this;
}

/**
 * next tick.
 * @param callback function
 */
function nextTick(callback) {
  if (typeof process !== 'undefined') {
    process.nextTick(callback);
  }
  else if (typeof this.self !== 'undefined' &&
           typeof this.self.setTimeout === 'function') {
    this.self.setTimeout(callback, 0);
  }
  else throw new Error('not supported (nextTick)');
}

//var util = require('util');
/**
 * class: Par
 * class method: dump
 */
Par.dump = function Par_dump() {
  //console.log('■■■Par.dump■■■');
  var s = '';
  for (var i in _pars) {
    s += '  ' + i + ':';
    for (var j in _pars[i]) {
      var k = j;
      var v = _pars[i][j];
      if (k === 'count')    k = 'cnt';
      if (k === 'results')  k = 'res';
      if (k === 'selector') k = 'sel';
      if (k === 'callback') {
        k = 'cb';
        if (v !== null && typeof v === 'object') v = Object.keys(v) + '';
      }
      if (v !== null && typeof v !== 'function')
        s += ' ' + k + '=' + JSON.stringify(v);
    }
    s += '\n';
    //console.log(i + ': ' + JSON.stringify(_pars[i]));
    //console.log(i + ': ' + util.inspect(_pars[i], false, null, true));
  }
  console.log(s);
}

module.exports = Par;
