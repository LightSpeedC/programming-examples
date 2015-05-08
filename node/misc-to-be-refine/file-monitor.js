/* file-monitor.js */

'use strict';

// File System {ファイル・システム}
var fs = require('fs');

/**
 * class FileMonitor: constructor
 * {ファイル監視クラス}
 * @param filePattern (RegEx)
 * @param dirPath directory path (String)
 * @param interval monitoring interval (seconds)
 * @param timeout monitoring timeout (seconds)
 * @param callback function (err, matchFiles)
 */
function FileMonitor(filePattern, dirPath, interval, timeout, callback) {
  this.filePattern = filePattern;
  this.dirPath = dirPath;
  this.interval = interval;
  this.timeout = timeout;
  this.callback = callback;
  this.timeoutId = null;
  this.intervalId = null;
  this.busy = false;
  this.stopping = false;
  return this;
}

/**
 * class FileMonitor: method start.
 * {ファイル監視を開始する}
 */
function FileMonitor_start() {
  this.stopping = false;

  this.timeoutId = setTimeout(function (that) {
      that.timeoutId = null;
      that.stop();
      that.callback(new Error('file not fouond'), []);
  }, this.timeout * 1000, this);

  if (this.busy) return;

  var cb = (function (that) {
    return function (errReadDir, dirFiles) {
      that.busy = false;
      that.intervalId = null;

      // fs.readdirがエラーの時は、そのままエラーとする
      if (errReadDir) {
        that.stop();
        return that.callback(errReadDir, []);
      }

      // filePatternにマッチしているものだけをフィルタする
      var matchFiles = [];
      for (var i = 0; i < dirFiles.length; ++i) {
        var m = dirFiles[i].match(that.filePattern);
        if (m && m[0] === dirFiles[i])
          matchFiles.push(dirFiles[i]);
      }

      // マッチしていれば、正常に終了する
      if (matchFiles.length > 0) {
        that.stop();
        return that.callback(null, matchFiles);
      }

      if (that.stopping) return;

      // 見つからなければ次のタイマーを開始し、fs.readdirを引き続き行う
      that.intervalId = setTimeout(function (that) {
        if (that.stopping) return;
        fs.readdir(that.dirPath, cb);
        that.busy = true;
      }, that.interval * 1000, that);
      return;
    };
  })(this);

  // 最初のfs.readdirを実行する
  fs.readdir(this.dirPath, cb);
  this.busy = true;

  return this;
}
FileMonitor.prototype.start = FileMonitor_start;

/**
 * class FileMonitor: method stop.
 * {ファイル監視を止める}
 */
function FileMonitor_stop() {
  this.stopping = true;
  if (this.timeoutId) {
    clearTimeout(this.timeoutId);
    this.timeoutId = null;
  }
  if (this.intervalId) {
    clearTimeout(this.intervalId);
    this.intervalId = null;
  }
  return this;
}
FileMonitor.prototype.stop = FileMonitor_stop;

module.exports = FileMonitor;
