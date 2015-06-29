// aa-dir-tree.js

this.dirTree = function () {
  'use strict';

  //var aa = require('co');
  var aa = require('aa');
  var fs = require('fs');
  var cofs = require('co-fs');
  var path = require('path');
  var $totalsize = '*totalsize*';
  //var $dirsize = '*dirsize*';

  function fs_stat(file) {
    return function (cb) {
      fs.stat(file, function (err, stat) {
        err && console.log('fs.stat: ' + err);
        if (err) cb(null, err); // !!! error -> data !!!
        else     cb(null, stat);
      });
    }
  }

  function *dirTree(dir, minSize, indent) {
    if (!dir) dir = '.';
    dir = path.resolve(dir);
    //console.log(dir);
    if (!indent) indent = 0;

    try {
      var names = yield cofs.readdir(dir);
    } catch (err) {
      console.log('fs.readdir: ' + err);
      children['*error'] = err;
      return children; //  null;
    }

    var totalsize = 0;
    var dirsize = 0;
    var children = {};

    names.forEach(function (name) { children[name] = null; });

    try {
      // sync parallel: fs.stat
      var res = yield names.map(function (name) {
        var file = path.resolve(dir, name);
        return {name:name, file:file, stat:fs_stat(file)}
      });
    } catch (err) {
      console.log('fs_stat: ' + err);
      children['*error'] = err;
      return children;
    }

    try {
    // sync parallel: dirTree
    res = yield res.map(function (elem) {
      var name = elem.name;
      var stat = elem.stat;

      if (stat instanceof Error) {
        console.log('stat error: ' + err);
        return {name:name, size:0, child:null};
      }

      var size = stat.size;
      var file = elem.file;

      if (stat.isDirectory())
        var child = dirTree(file, minSize, indent + 1);

      return {name:name, size:size, child:child}
    });
    } catch (err) {
      console.log('dirTree: ' + err);
      children['*error'] = err;
      return children;
    }

    // rest of process
    res.map(function (elem) {
      var name = elem.name;
      var size = elem.size;
      var child = elem.child;

      if (child instanceof Error)
        children[name] = size;
      else if (child) {
        if (child[$totalsize] >= minSize)
          children[name] = child;
        else
          children[name] = child[$totalsize];
        totalsize += child[$totalsize];
      }
      else
        children[name] = size;

      totalsize += size;
      dirsize += size;

      return {name:name, size:size, child:child};
    });

    children[$totalsize] = totalsize;
    return children;
  }

  dirTree.dirTree = dirTree;

  // node.js module.exports
  if (typeof module === 'object' && module && module.exports) {
    module.exports = dirTree;

    // main
    if (require.main === module) {
      var dir = require('path').resolve(process.argv[2] || '.');
      console.log(dir);
      var tree = 
      aa(dirTree(dir, eval(process.argv[3]) || 0, 0))
      .then(
        function (tree) {
          console.log(require('util').inspect(tree,
            {colors: false, depth: null}).replace(/\'/g, ''));
        },
        function (err) {
          console.log(err.stack);
        }
      ); // then
    }

  }

  return dirTree;
}();
