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

  function *dirTree(dir, minSize) {
    if (!dir) dir = '.';
    dir = path.resolve(dir);

    try {
      var names = yield cofs.readdir(dir);
    } catch (err) {
      err && console.log('fs.readdir: ' + err);
      return err; //  null;
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
      err && console.log('fs_stat: ' + err);
      children['*error'] = err;
      return children;
    }

    try {
    // sync parallel: dirTree
    res = yield res.map(function (elem) {
      var stat = elem.stat;

      if (stat instanceof Error)
        return {name:elem.name, size:0, child:null};

      var size = stat.size;

      if (stat.isDirectory())
        var child = dirTree(elem.file);

      return {name:elem.name, size:size, child:child}
    });
    } catch (err) {
      err && console.log('dirTree: ' + err);
      children['*error'] = err;
      return children;
    }

    // rest of process
    res.map(function (elem) {
      var name = elem.name;
      var size = elem.size;
      var child = elem.child;

      if (child) {
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

      return {name: elem.name, size: elem.size, child: child};
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
      var tree = 
      aa(dirTree(process.argv[2] || '.', eval(process.argv[3]) || 0)).then(function (tree) {
        console.log(require('util').inspect(tree,
          {colors: false, depth: null}).replace(/\'/g, ''));
      }, function (err) {
        console.log(err.stack);
      });
    }

  }

  return dirTree;
}();
