// mkdir-parents.js

'use strict';

var fs = require('fs');
var path = require('path');

//######################################################################
/**
 * Function: make directory with parents recursively (sync)
 * Param   : dir: path to make directory
 *           mode: file mode to make directory
 */
function mkdirParentsSync(dir, mode) {
  // check arguments
  if (typeof dir !== 'string')
    throw new Error('mkdirParentSync: directory path required');

  var dirList = [];
  while (!fs.existsSync(dir))
    dirList.push(dir), dir = path.resolve(dir, '..');

  while (dir = dirList.pop())
    fs.mkdirSync(dir, mode);
} // mkdirParentsSync


//######################################################################
/**
 * Function: make directory with parents recursively (async)
 * Param   : dir: path to make directory
 *           mode: file mode to make directory
 *           callback: callback(err) function
 */
function mkdirParents(dir, mode, callback) {
  // check arguments
  if (typeof dir !== 'string')
    throw new Error('mkdirParent: directory path required');

  if (mode && typeof mode === 'function')
    callback = mode, mode = undefined;

  if (mode && typeof mode !== 'number')
    throw new Error('mkdirParent: mode must be a number');

  if (callback && typeof callback !== 'function')
    throw new Error('mkdirParent: callback must be function');

  // local variables
  var dirList = []; // directories that we have to make directory

  return fs.exists(dir, existsCallback);

  // fs.exists callback...
  function existsCallback(exists) {
    if (exists)
      return mkdirCallback(null);

    // if dir does not exist, then we have to make directory
    dirList.push(dir), dir = path.resolve(dir, '..');

    return fs.exists(dir, existsCallback);
  } // existsCallback

  // fs.mkdir callback...
  function mkdirCallback(err) {
    if (err)
      return mkdirParentsCallback(err);

    dir = dirList.pop();
    if (!dir)
      return mkdirParentsCallback(null);

    return fs.mkdir(dir, mode, mkdirCallback);
  } // mkdirCallback

  // mkdirParents callback...
  function mkdirParentsCallback(err) {
    if (callback)
      return callback(err);

    if (err)
      throw err;
  } // mkdirParentsCallback

} // mkdirParents

module.exports.mkdirParentsSync = mkdirParentsSync;
module.exports.mkdirParents     = mkdirParents;
