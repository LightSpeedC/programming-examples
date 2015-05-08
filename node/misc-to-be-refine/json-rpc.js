/* json-rpc.js */

'use strict';


//######################################################################
/**
 * class: JSONRPC.
 *
 * @param func process message function
 * @see http://www.jsonrpc.org/specification
 *
 * process message function: {電文処理関数}
 *   @param reqMsg JSONRPC request message object {RPC要求電文}
 *   @param callback function {コールバック関数}
 *     this.callback(err, resMsg, reqMsg);
 *   function processFunction(reqMsg, callback) {
 *     var rpc = this;
 *   }
 */
function JSONRPC(func) {
  if (!(this instanceof JSONRPC))
    return new JSONRPC(func);

  this.processFunction = func;
}
module.exports.JSONRPC = exports.JSONRPC = JSONRPC;


//######################################################################
/**
 * method: set process function. {メソッド：電文処理関数をセット}
 *
 * @param func Function for process
 */
function setProcessFunction(func) {
  this.processFunction = func;
  return this;
}
JSONRPC.prototype.setProcessFunction = setProcessFunction;


//######################################################################
/**
 * method: process messages. {メソッド：複数電文処理}
 *
 * @param reqMsg JSONRPC request message object {RPC要求電文}
 * @param callback function {コールバック関数}
 *   callback(err, resMsg, reqMsg);
 * @return JSONRPC response message object {RPC応答電文を返す}
 */
function processMessages(reqMsg, callback) {
  var that = this;

  if (reqMsg && typeof reqMsg === 'object' && !(reqMsg instanceof Array))
    return nextTick(function () {
      return that.processMessage(reqMsg, function (err, resMsg, reqMsg) {
        return nextTick(function () {
          return callback.call(that, err, resMsg, reqMsg);
        });
      });
    });
  else
    throw new Error('Array not supported!!!');
/*
  else if (reqMsg instanceof Array) {
    if (reqMsg.length === 0)
      return nextTick(function () {
        return callback.call(that, new Error('length of array is zero'),
          that.createInvalidRequest(null, 'length of array is zero'),
          reqMsg);
      });

    var tasks = [];
    var resMsg = [];
    for (var key in reqMsg) {
      tasks.push((function (reqMsg, callback, that) {
        return function () {
          that.processMessage(reqMsg, callback);
        };
      })(reqMsg[key], function (err, result, reqMsg) {
        if (result !== null) resMsg.push(result);
      }, that);

    }


    var resMsg = [];
    for (var key in reqMsg) {
      @@var result = that.processMessage(reqMsg[key], callback);
      @@if (result !== null) resMsg.push(result);
    }
    @@return resMsg;
  }
  else
    @@return createInvalidRequest(null, 'message is not object or array');
*/
}
JSONRPC.prototype.processMessages = processMessages;


//######################################################################
/**
 * method: process one message. {メソッド：1つの電文を処理}
 *
 * @param reqMsg JSONRPC request message object {RPC要求電文}
 * @param callback function {コールバック関数}
 *   callback(err, resMsg, reqMsg);
 * @return JSONRPC response message object {RPC応答電文を返す}
 */
function processMessage(reqMsg, callback) {
  var that = this;

  // オブジェクトか?
  if (typeof reqMsg !== 'object') 
    return nextTick(function () {
      callback.call(that, new Error('message is not an object or an array'),
        createInvalidRequest(null, 'message is not an object or an array'),
        reqMsg);
    });

  // id は、あるか?
  var id = null; // notification?
  if ('id' in reqMsg) id = reqMsg.id; // not notification!

  // jsonrpc は、あるか?
  if (!('jsonrpc' in reqMsg))
    return nextTick(function () {
      callback.call(that, new Error('jsonrpc does not found'),
        createInvalidRequest(id, 'jsonrpc does not found'),
        reqMsg);
    });

  // jsonrpc == 2.0 か?
  if (reqMsg.jsonrpc !== '2.0')
    return nextTick(function () {
      callback.call(that, new Error('jsonrpc is wrong: ' + reqMsg.jsonrpc + ' != 2.0'),
        createInvalidRequest(id, 'jsonrpc is wrong: ' + reqMsg.jsonrpc + ' != 2.0'),
        reqMsg);
    });

  // method は、あるか?
  if (!('method' in reqMsg))
    return nextTick(function () {
      callback.call(that, new Error('method not found'),
        createMethodNotFound(id),
        reqMsg);
    });

  // params は、あるか?
  if ('params' in reqMsg && typeof reqMsg.params !== 'object')
    return nextTick(function () {
      callback.call(that, new Error('params is wrong'),
        createInvalidRequest(id, 'params is wrong'),
        reqMsg);
    });

//  if (typeof reqMsg.params !== 'object' && !(reqMsg.params instanceof Array))
//    return nextTick(function () {
//      callback.call(that, new Error('params is not Object or Array'),
//        createInvalidParams(id, 'params is not Object or Array'),
//        reqMsg);
//    });

  // 処理関数を呼び出す。
  return nextTick(function () {
    that.processFunction(reqMsg, function (err, resMsg, reqMsg) {
      //if (id === null)
      //  return callback.call(that, null, null, reqMsg);

      // エラーか? 異常時は、コールバックを呼ぶ。
      // (result は、エラー時の応答電文形式と想定)
      // 正常に処理されたら、正常なメッセージに変換
      if (!err)
        resMsg = createResponseMessage(reqMsg.id, resMsg);

      // コールバックを呼ぶ。
      return nextTick(function () {
        callback.call(that, err, resMsg, reqMsg);
      });
    });
  });
/*
  if (id === null)
    return nextTick(function () {
      callback.call(that, null, null, reqMsg);
    });
*/
}
JSONRPC.prototype.processMessage = processMessage;


//######################################################################
/**
 * method: create request message. {メソッド：RPC要求電文を作成}
 *
 * @param id number or string {id番号か文字列}
 * @param method string {メソッド文字列}
 * @param params object or array {パラメータオブジェクト(オブジェクトか配列)}
 * @return JSONRPC request message objec {RPC要求電文を返す}t
 */
function createRequestMessage(id, method, params) {
  return {jsonrpc: '2.0', method: method, params: params, id: id};
}
JSONRPC.prototype.createRequestMessage = createRequestMessage;


//######################################################################
/**
 * method: create response message. {メソッド：RPC応答電文を作成}
 *
 * @param id number or string {id番号か文字列}
 * @param result object {結果オブジェクト}
 * @return JSONRPC response message objec {RPC応答電文を返す}t
 */
function createResponseMessage(id, result) {
  return {jsonrpc: '2.0', result: result, id: id};
}
JSONRPC.prototype.createResponseMessage = createResponseMessage;


//######################################################################
/**
 * method: parse request data. {メソッド：要求データを解析}
 *
 * @param reqData String of JSONRPC request data {RPC要求データ文字列}
 * @return JSONRPC request message object or JSONRPC response error object
 *         {RPC要求電文オブジェクト、または、RPC応答エラーオブジェクト}
 */
function parseRequestData(reqData) {
  var reqMsg;
  if (reqData.charCodeAt(0) === 0xFEFF)
    reqData = reqData.slice(1);
  try {
    var reqMsg = JSON.parse(reqData);
  } catch (e) {
    return createParseError(null, reqData);
  }
  return reqMsg;
}
JSONRPC.prototype.parseRequestData = parseRequestData;


//######################################################################
/**
 * method: send response. {応答を返す}
 *
 * @param res HTTP Response object {HTTP応答オブジェクト}
 * @param reqMsg JSONRPC response message object {RPC応答電文オブジェクト}
 */
function sendResponse(res, resMsg) {
  res.writeHead(200, {'content-type': 'application/json'});
  //res.write(data, 'binary');
  if (!resMsg)
    res.end();
  else
    res.end(JSON.stringify(resMsg), 'utf-8');
  return this;
}
JSONRPC.prototype.sendResponse = sendResponse;


//######################################################################
/**
 * method: create error message. {メソッド：エラー電文を作成}
 *
 * @param id JSONRPC request message id or zero
 * @param code JSONRPC error code
 * @param message JSONRPC error message
 * @param data JSONRPC error data (optional)
 * @return JSONRPC response error object

The error codes from and including -32768 to -32000 are reserved for pre-defined errors.
Any code within this range, but not defined explicitly below is reserved for future use.
The error codes are nearly the same as those suggested for XML-RPC at the following
url: http://xmlrpc-epi.sourceforge.net/specs/rfc.fault_codes.php

code	message	meaning
-32700	Parse error	Invalid JSON was received by the server.
			An error occurred on the server while parsing the JSON text.
-32600	Invalid Request	The JSON sent is not a valid Request object.
-32601	Method not found	The method does not exist / is not available.
-32602	Invalid params	Invalid method parameter(s).
-32603	Internal error	Internal JSON-RPC error.
-320xx	Server error	Reserved for implementation-defined server-errors.

 */
//======================================================================
// エラー電文を作成
function createErrorMessage(id, code, message, data) {
  var resMsg = {jsonrpc: '2.0',
    error: {code: code, message: message},
    id: id};
  if (data !== 'undefined')
    resMsg.error.data = data;
  return resMsg;
}
JSONRPC.prototype.createErrorMessage = createErrorMessage;

//======================================================================
// 解析エラー電文を作成
function createParseError(id, data) {
  return createErrorMessage(id, -32700, 'Parse error', data); }
JSONRPC.prototype.createParseError = createParseError;

//======================================================================
// 不要な要求エラー電文を作成
function createInvalidRequest(id, data) {
  return createErrorMessage(id, -32600, 'Invalid Request', data); }
JSONRPC.prototype.createInvalidRequest = createInvalidRequest;

//======================================================================
// メソッドが見つからないエラー電文を作成
function createMethodNotFound(id, data) {
  return createErrorMessage(id, -32601, 'Method not found', data); }
JSONRPC.prototype.createMethodNotFound = createMethodNotFound;

//======================================================================
// 不正なパラメータエラー電文を作成
function createInvalidParams(id, data) {
  return createErrorMessage(id, -32602, 'Invalid params', data); }
JSONRPC.prototype.createInvalidParams = createInvalidParams;

//======================================================================
// 内部エラー電文を作成
function createInternalError(id, data) {
  return createErrorMessage(id, -32603, 'Internal error', data); }
JSONRPC.prototype.createInternalError = createInternalError;

//======================================================================
// サーバエラー電文を作成
function createServerError(id, code, data) {
  return createErrorMessage(id, -32000 - code, 'Server error', data); }
JSONRPC.prototype.createServerError = createServerError;


//######################################################################
// 次の非同期実行タイミングで処理する
function nextTick(func) {
  return setImmediate(func);
  //return setTimeout(func, 100);
}


//######################################################################
/**
 * function typeOf. {引数の型を返す関数}
 *
 * @param obj JavaScript object
 * @return String type of object
 *
 * @see http://qiita.com/items/465e715dae14e2f601de
 * @see http://bonsaiden.github.io/JavaScript-Garden/ja/#types.typeof
 *
 * function is(type, obj) { return type === typeOf(obj); }
 * function typeOf(obj) { return Object.prototype.toString.call(obj).slice(8, -1); }
 */
function typeOf(obj) { return Object.prototype.toString.call(obj).slice(8, -1); }
JSONRPC.prototype.typeOf = typeOf;
