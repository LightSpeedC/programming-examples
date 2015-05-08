// rmdir-recursive.js

'use strict';

var fs = require('fs');
var path = require('path');

//######################################################################
/**
 * Function: remove directory recursively (sync)
 * Param   : dir: path to make directory
 */
function rmdirRecursiveSync(dir) {
  // check arguments
  if (typeof dir !== 'string')
    throw new Error('rmdirRecursiveSync: directory path required');

  if (!fs.existsSync(dir)) return;

  var stat = fs.statSync(dir);

  if (!stat.isDirectory())
    return fs.unlinkSync(dir);

  var files = fs.readdirSync(dir);

  for (var i = 0, n = files.length; i < n; ++i)
    rmdirRecursiveSync(path.resolve(dir, files[i]));

  return fs.rmdirSync(dir);
}


//######################################################################
/**
 * Function: remove directory recursively (async)
 * Param   : dir: path to make directory
 *           callback: callback(err) function
 */
function rmdirRecursive(dir, callback) {
  // check arguments
  if (typeof dir !== 'string')
    throw new Error('rmdirRecursive: directory path required');

  if (callback && typeof callback !== 'function')
    throw new Error('rmdirRecursive: callback must be function');

  var finished = false;

  return fs.exists(dir, function existsCallback(exists) {
    if (!exists) return rmdirRecursiveFinish(null);

    fs.stat(dir, statCallback);

    // fs.stat callback...
    function statCallback(err, stat) {
      if (err) return rmdirRecursiveFinish(err);

      if (!stat.isDirectory())
        return fs.unlink(dir, rmdirRecursiveFinish);

      var files = fs.readdir(dir, readdirCallback);
    } // statCallback

    // fs.readdir callback...
    function readdirCallback(err, files) {
      if (err) return rmdirRecursiveFinish(err);

      var n = files.length;
      if (n === 0)
        return fs.rmdir(dir, rmdirRecursiveFinish);

      for (var i = 0; i < n; ++i) {
        rmdirRecursive(path.resolve(dir, files[i]), function (err) {
          if (err) return rmdirRecursiveFinish(err);

          if (--n) return;

          return fs.rmdir(dir, rmdirRecursiveFinish);
        }); // rmdirRecursive
      } // for i < n
    } // readdirCallback

  }); // fs.exists

  // rmdirRecursive finish...
  function rmdirRecursiveFinish(err) {
    if (callback)
      return finished ? undefined : finished = true, callback(err);

    if (err)
      throw err;
  } // rmdirRecursiveFinish

} // rmdirRecursive

module.exports.rmdirRecursiveSync = rmdirRecursiveSync;
module.exports.rmdirRecursive     = rmdirRecursive;
