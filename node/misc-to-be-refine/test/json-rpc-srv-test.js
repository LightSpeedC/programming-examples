/* json-rpc-srv-test.js */

'use strict';

var http = require('http');
var url  = require('url');

// LogManager {ログ管理}
var log = require('log-manager').getLogger().setLevel('DEBUG');

// JSON-RPC
var JSONRPC = require('json-rpc').JSONRPC;
var rpc = new JSONRPC(processMessageTest);

// http server service port
var SVC_PORT = 8081;

// http request count
var requestCount = 0;


//######################################################################
http.createServer(function onRequestServer(req, res) {
  var count = ++requestCount;
  log.trace('(%s) REQUEST:', count, req.method, req.url);

  var reqData = '';
  req.on('readable', function onReadableReq() {
    var data = req.read()
    if (!data) return;
    reqData += data;
  });

  req.on('end', function onEndReq() {
    log.debug('(%s) RECEIVED DATA:', count, reqData);

    var reqMsg = rpc.parseRequestData(reqData);
    if ('error' in reqMsg) {
      log.warn('(%s) ERROR PARSING REQUEST:', count, {reqData: reqData}, {error: reqMsg.error});
      log.debug('(%s) SEND RESPONSE!■■■■■■■■■■', count);
      return rpc.sendResponse(res, reqMsg);
    }

    rpc.processMessages(reqMsg, function (err, resMsg, reqMsg) {
      if (err) {
        log.info('(%s) ERROR PROCESSING REQUEST:', count, reqMsg);
        log.warn('(%s) ERROR RESPONSE:', count, resMsg.error);
      }
      else {
        log.info('(%s) REQUEST:', count, reqMsg.method, reqMsg.params);
        log.info('(%s) RESPONSE:', count, resMsg.result);
      }
      log.debug('(%s) SEND RESPONSE!■■■■■■■■■■', count);
      rpc.sendResponse(res, resMsg);
    });
  });
}).listen(SVC_PORT, function () {
  log.info('json-rpc server', SVC_PORT, ' started');
});
log.trace('json-rpc server', SVC_PORT, ' starting');


//######################################################################
// processMessageTest
function processMessageTest(reqMsg, callback) {
  var that = this;

  var id = null;
  if ('id' in reqMsg) id = reqMsg.id;
  var result;

  // id が無ければ、結果は null とする
  if (!('id' in reqMsg))
    return callback.call(that, null, null, reqMsg);

  // メソッドが違う場合はエラーとする
  if (reqMsg.method !== 'subtract')
    return nextTick(function () {
      callback.call(that, new Error('method has not supported: ' + reqMsg.method),
        that.createInvalidParams(id, 'method has not supported: ' + reqMsg.method),
        reqMsg);
    });

  // パラメータ存在チェック
  if ('params' in reqMsg)
    return nextTick(function () {
      callback.call(that, new Error('params does not exist'),
        that.createInvalidParams(id, 'params does not exist'),
        reqMsg);
    });

  // パラメータはオブジェクト
  var params = reqMsg.params;
  if (this.typeOf(params) !== 'Object')
    return nextTick(function () {
      callback.call(that, new Error('params is not an object'),
        that.createInvalidParams(id, 'params is not an object'),
        reqMsg);
    });

//  // パラメータは配列?
//  if (this.typeOf(reqMsg.params) === 'Array') {
//    if (reqMsg.params.length == 2)
//      @@result = reqMsg.params[0] - reqMsg.params[1];
//    else
//      return that.createInvalidParams(id, 'params length is not 2');
//  }
//  else if (typeof reqMsg.params === 'object') {

  if (!('minuend' in params) || !('subtrahend' in params))
    return nextTick(function () {
      callback.call(that, new Error('params does not have minuend and subtrahend'),
        that.createInvalidParams(id, 'params does not have minuend and subtrahend'),
        reqMsg);
    });

  result = reqMsg.params.minuend - reqMsg.params.subtrahend;

  return nextTick(function () {
    callback.call(that, null, result, reqMsg);
  });
}


//######################################################################
// 次の非同期実行タイミングで処理する
function nextTick(func) {
  setImmediate(func);
  // setTimeout(func, 100);
}
