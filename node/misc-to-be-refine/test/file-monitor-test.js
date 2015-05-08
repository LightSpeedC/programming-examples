/* file-monitor-test.js */

var FileMonitor = require('file-monitor');

var TIME_LIMIT = 10; // seconds {秒}

var monitor = new FileMonitor(/.*\.mon/, '.', 0.5, TIME_LIMIT,
  function (err, files) {
    console.log('ファイル監視結果: ' + (err ? err + ' ' : '') + files);

    var monitor2 = new FileMonitor(/.*\.mon/, 'c:/directorynotfound/', 0.5, TIME_LIMIT,
      function (err, files) {
        console.log('ファイル監視2結果: ' + (err ? err + ' ' : '') + files);
      }
    );
    console.log('ファイル監視2開始: エラーを期待 (' + TIME_LIMIT + '秒)');
    monitor2.start();
  }
);
console.log('ファイル監視開始: *.mon (' + TIME_LIMIT + '秒)');
monitor.start();
