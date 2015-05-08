// json-rpc-cli-test.js

'use strict';

var http = require('http');

// LogManager {ログ管理}
var log = require('log-manager').getLogger().setLevel('DEBUG');

var options = {
  host: 'localhost',
  port: 8081,
  path: '/',
  method: 'POST',
};

log.trace({OPTIONS: options});

function onRequestResponse(res) {
  if (res.statusCode == 200) log.debug({STATUS: res.statusCode});
  else log.warn({STATUS: res.statusCode});
  log.trace({HEADERS: res.headers});

  res.setEncoding('utf8');

  var resData = '';
  res.on('readable', function () {
    var chunk = res.read();
    resData += chunk;
    log.trace({'CHUNK-lENGTH': chunk.length, CHUNK: chunk});
  });

  res.on('end', function () {
    if (!resData || resData === '')
      return log.warn({END: 'NO DATA!'});

    var resMsg = JSON.parse(resData);
    if (resMsg.error)
      return log.warn({'END-ERROR': resMsg.error});
    if (resMsg.error)
      return log.info({'END-RESULT': resMsg.result});
    log.warn({END: resMsg});
  });
}

var id = 123;

var req = http.request(options, onRequestResponse);
req.end('{xx');

//var req = http.request(options, onRequestResponse);
//req.end('[]');

//var req = http.request(options, onRequestResponse);
//req.end('[1]');

//var req = http.request(options, onRequestResponse);
//req.end('[1,2,3]');

var req = http.request(options, onRequestResponse);
var reqMsg = {jsonrpc: '2.0',
  method: 'meth1',
  params: {data:{x:1, y:2}},
  id: id++};
req.end(JSON.stringify(reqMsg));

var req = http.request(options, onRequestResponse);
var reqMsg = {version: '1.1',
  method: 'meth1',
  params: {data:{x:1, y:2}},
  id: id++};
req.end(JSON.stringify(reqMsg));

var req = http.request(options, onRequestResponse);
var reqMsg = {jsonrpc: '2.0',
  method: 'subtract',
  params: {minuend: 10, subtrahend: 3},
  id: id++};
req.end(JSON.stringify(reqMsg));

// 日本語
