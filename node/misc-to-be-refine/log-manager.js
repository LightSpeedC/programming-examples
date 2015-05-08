// log-manager.js

// // LogManager {ログ管理}
// var LogManager = require('log-manager');
// var log = LogManager.getLogger();

// var log = LogManager.getLogger('className1');

// var log = require('log-manager').getLogger();

// log.trace(msg, arg1, arg2, ...);
// log.debug(msg, arg1, arg2, ...);
// log.info(msg, arg1, arg2, ...);
// log.warn(msg, arg1, arg2, ...);
// log.error(msg, arg1, arg2, ...);
// log.fatal(msg, arg1, arg2, ...);

// LogManager.setLevel('TRACE'); // all
// LogManager.setLevel('DEBUG');
// LogManager.setLevel('INFO'); // default
// LogManager.setLevel('WARN');
// LogManager.setLevel('ERROR');
// LogManager.setLevel('FATAL'); // FATAL only

// var mgr = new LogManager();
// mgr.setLevel('DEBUG');
// var log = mgr.getLogger();
// log.setLevel('WARN');

'use strict';

var util = require('util');

var toDateTimeString = require('date-time').toDateTimeString;


//######################################################################
// color definition. {カラー定義}
var CSI = '\u001B['; // Escape Sequence: Control Sequence Introducer

var COLOR_NORMAL     = CSI + 'm';
var COLOR_DARK_GRAY  = CSI + '90m';
var COLOR_CALLEE     = CSI + ';34m';
var COLOR_CLASS      = CSI + ';34;1m';
var COLOR_DANGER     = CSI + ';31m';
var COLOR_CAUTION    = CSI + ';41;91m';
var COLOR_TIME       = CSI + '44m';

var COLOR_TRACE = CSI + '44;5m';
var COLOR_DEBUG = CSI + '46;30;21m';
var COLOR_INFO  = CSI + '42;30;21m';
var COLOR_WARN  = CSI + '43;5;30;21m';
var COLOR_ERROR = CSI + '41;5;97m';
var COLOR_FATAL = CSI + '45;5;97m';

var CRLF = '\r\n';

var LEVEL_TRACE = 0;
var LEVEL_DEBUG = 1;
var LEVEL_INFO  = 2;
var LEVEL_WARN  = 3;
var LEVEL_ERROR = 4;
var LEVEL_FATAL = 5;

var COLOR_LEVELS = [
  {no: LEVEL_TRACE, name: 'TRACE', level: 'TRACE', color: COLOR_TRACE},
  {no: LEVEL_DEBUG, name: 'DEBUG', level: 'DEBUG', color: COLOR_DEBUG},
  {no: LEVEL_INFO,  name: 'INFO ', level: 'INFO' , color: COLOR_INFO },
  {no: LEVEL_WARN,  name: 'WARN ', level: 'WARN' , color: COLOR_WARN },
  {no: LEVEL_ERROR, name: 'ERROR', level: 'ERROR', color: COLOR_ERROR},
  {no: LEVEL_FATAL, name: 'FATAL', level: 'FATAL', color: COLOR_FATAL}];
for (var i = 0; i <= 5; ++i)
  COLOR_LEVELS[COLOR_LEVELS[i].level] = COLOR_LEVELS[i],
  COLOR_LEVELS[COLOR_LEVELS[i].level.toLowerCase()] = COLOR_LEVELS[i];


//######################################################################
/**
 * class LogManager {ログ・マネージャ・クラス}
 */
function LogManager() {
  if (!(this instanceof LogManager))
    return new LogManager();
}


// class LogManager methods {ログ・マネージャ・クラスのメソッド}
LogManager.getLogger           = LogManager_getLogger.bind(LogManager);
LogManager.prototype.getLogger = LogManager_getLogger;
LogManager.$print              = LogManager_print.bind(LogManager);
LogManager.prototype.$print    = LogManager_print;
LogManager.$format             = LogManager_format.bind(LogManager);
LogManager.prototype.$format   = LogManager_format;
LogManager.setLevel            = LogManager_setLevel.bind(LogManager);
LogManager.prototype.setLevel  = LogManager_setLevel;
LogManager.setWriter           = LogManager_setWriter.bind(LogManager);
LogManager.prototype.setWriter = LogManager_setWriter;
LogManager.write               = LogManager_write.bind(LogManager);
LogManager.prototype.write     = LogManager_write;
LogManager.level               = LEVEL_INFO;
LogManager.prototype.level     = LEVEL_INFO;
LogManager.writer              = process.stdout;
LogManager.prototype.writer    = process.stdout;


//======================================================================
// LogManager getLogger ロガー取得
function LogManager_getLogger(name) {
  var manager = this;
  if (this !== LogManager && !(this instanceof LogManager))
    manager = LogManager;

  if (!name) {
    var stack = new Error().stack.split('\n')[2].replace(/\\/g, '/');
    name = stack.slice(stack.lastIndexOf('/') + 1, stack.lastIndexOf('.'));
  }
  return new Logger(name, manager);
}


//======================================================================
// LogManager setLevel レベル設定
function LogManager_setLevel(level) {
  if (!COLOR_LEVELS[level])
    throw new Error('no such level: ' + level);

  this.level = COLOR_LEVELS[level].no;
  return this;
}


//======================================================================
// LogManager setWriter 出力先設定
function LogManager_setWriter(writer) {
  this.writer = writer;
  return this;
}


//======================================================================
// LogManager write 出力
function LogManager_write() {
  var msg = LogManager_format.apply(null,
    arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments));

  this.writer.write(msg);
  if (this.writer !== process.stdout)
    process.stdout.write(msg);
  return this;
}


//======================================================================
// LogManager writeln 出力(改行)
function LogManager_writeln() {
  var msg = LogManager_format.apply(null,
    arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments)) + CRLF;

  this.writer.write(msg);
  if (this.writer !== process.stdout)
    process.stdout.write(msg);
  return this;
}


//======================================================================
// LogManager print 表示
function LogManager_print() {
  var msg = LogManager_format.apply(null,
    arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments)) + CRLF;

  this.writer.write(msg);
  if (this.writer !== process.stdout)
    process.stdout.write(msg);
  // console.log(msg);
  return this;
}


//======================================================================
// LogManager inspect 探索/インスペクト
function LogManager_inspect(obj) {
  return util.inspect(obj, {showHidden: false, depth: null, colors: true});
}


//======================================================================
// LogManager format 整形/フォーマット
function LogManager_format() {
  // 引数を配列に変換
  var args = arguments.length === 1 ? [arguments[0]] :
             Array.apply(null, arguments);

  for (var i = 0, n = args.length; i < n; ++i) {
    if (args[i] === null)
      args[i] = 'null';
    else if (typeof args[i] === 'object')
      args[i] = LogManager_inspect(args[i]);
    else if (typeof args[i] !== 'string')
      args[i] = '' + args[i];
  }
  return util.format.apply(util, args);
}


//######################################################################
/**
 * class Logger {ロガー・クラス}
 */
function Logger(name, manager) {
  if (!(this instanceof Logger))
    return new Logger(name, manager);

  this.$name = name ? name : '';
  this.$manager = manager;
}


// class Logger methods {ロガー・クラスのメソッド}
Logger.prototype.$printStack = Logger_printStack;
Logger.prototype.$printLevel = Logger_printLevel;
Logger.prototype.setLevel    = Logger_setLevel;
Logger.prototype.trace = Logger_trace;
Logger.prototype.debug = Logger_debug;
Logger.prototype.info  = Logger_info;
Logger.prototype.warn  = Logger_warn;
Logger.prototype.error = Logger_error;
Logger.prototype.fatal = Logger_fatal;
Logger.prototype.isTrace = Logger_isTrace;
Logger.prototype.isDebug = Logger_isDebug;
Logger.prototype.isInfo  = Logger_isInfo;
Logger.prototype.isWarn  = Logger_isWarn;
Logger.prototype.isError = Logger_isError;
Logger.prototype.isFatal = Logger_isFatal;


//======================================================================
// Logger printStack {プリント・スタック}
function Logger_printStack() {
  var stacks = new Error().stack.replace(/\\/g, '/').split('\n');

  this.$manager.$print(COLOR_CAUTION + stacks[3] + COLOR_NORMAL);
  for (var i = 4, n = stacks.length; i < n; ++i)
    this.$manager.$print(COLOR_DANGER + stacks[i] + COLOR_NORMAL);
  return this;
}


//======================================================================
// Logger printLevel {プリント・レベル}
function Logger_printLevel(level, args) {
  // 引数をメッセージ文字列に整形
  var msg = LogManager_format.apply(null,
    args.length === 1 ? [args[0]] : Array.apply(null, args));

  var color = COLOR_LEVELS[level].color;
  var name = COLOR_LEVELS[level].name;

  var stack = new Error().stack.split('\n')[3].replace(/\\/g, '/');
  var pos = stack.slice(stack.lastIndexOf('/') + 1, stack.lastIndexOf(':'));
  var prefix = pos.slice(0, pos.lastIndexOf('.'));
  var callee = (prefix === this.$name ? '' : COLOR_CLASS + ' [' + this.$name + '] ') +
    COLOR_CALLEE + '(' + pos + ')' + COLOR_NORMAL;

  this.$manager.$print(COLOR_TIME + toDateTimeString() + ' ' +
    color + name + COLOR_NORMAL + ' ' + msg + ' ' + callee);
  return this;
}


//======================================================================
// Logger setLevel レベル設定
function Logger_setLevel(level) {
  this.$manager.setLevel(level);
  return this;
}


//======================================================================
// Logger trace {トレース}
function Logger_trace() {
  if (this.$manager.level > LEVEL_TRACE) return this;
  return this.$printLevel(LEVEL_TRACE, arguments);
}
function Logger_isTrace() {
  return this.$manager.level <= LEVEL_TRACE;
}


//======================================================================
// Logger debug {デバッグ}
function Logger_debug() {
  if (this.$manager.level > LEVEL_DEBUG) return this;
  return this.$printLevel(LEVEL_DEBUG, arguments);
}
function Logger_isDebug() {
  return this.$manager.level <= LEVEL_DEBUG;
}


//======================================================================
// Logger info {情報}
function Logger_info() {
  if (this.$manager.level > LEVEL_INFO) return this;
  return this.$printLevel(LEVEL_INFO, arguments);
}
function Logger_isInfo() {
  return this.$manager.level <= LEVEL_INFO;
}


//======================================================================
// Logger warn {警告}
function Logger_warn() {
  if (this.$manager.level > LEVEL_WARN) return this;
  return this.$printLevel(LEVEL_WARN, arguments);
}
function Logger_isWarn() {
  return this.$manager.level <= LEVEL_WARN;
}


//======================================================================
// Logger error {エラー}
function Logger_error() {
  if (this.$manager.level > LEVEL_ERROR) return this;
  return this.$printLevel(LEVEL_ERROR, arguments).$printStack();
}
function Logger_isError() {
  return this.$manager.level <= LEVEL_ERROR;
}


//======================================================================
// Logger fatal {重大}
function Logger_fatal() {
  return this.$printLevel(LEVEL_FATAL, arguments).$printStack();
}
function Logger_isFatal() {
  return this.$manager.level <= LEVEL_FATAL;
}


//######################################################################
module.exports = LogManager;
