  var MiniXHR = require('./mini-xhr');

  var xhr = new MiniXHR('http://localhost:8080/');
  var xhr2 = new MiniXHR('http://localhost:8080/');

  xhr.get('index.html')
  .then(
    function (val) { console.log('get index.html', val.length); },
    function (err) { console.log('get index.html', err); });
  xhr2.post('echo', {x:1,y:2})
  .then(
    function (val) { console.log('post echo', val); },
    function (err) { console.log('post echo', err); });

  // /xhr.request();
