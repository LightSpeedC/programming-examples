/* ini-file.js */

'use strict';

/**
 * INI file. {INIファイル}
 *
 * @author LightSpeedC (Kazuaki Nishizawa; 西澤 和晃)
 *
 * @see <<http://ja.wikipedia.org/wiki/INI%E3%83%95%E3%82%A1%E3%82%A4%E3%83%AB>>
 * @see <<http://ja.wikipedia.org/wiki/INIファイル>>
 *
 * Specification: {仕様:}
 *
 *     Comment {コメント}
 *         ; comment text
 *         # comment text
 *
 *         Blank line is also ignored. {空行も無視される}
 *
 *     Section {セクション}
 *         [section]
 *
 *     Parameter {パラメータ}
 *         name=value
 *
 *         delimiter is equal sign "=" only. do not use colon ":".
 *         {デリミタは等号のみ使用できる。コロンなどは使用してはいけない。}
 *
 *     Conflict parameter name {パラメータ名の重複}
 *         override. {上書きされる。
 *
 *     Conflict section name {セクション名の重複}
 *         merged. {マージされる。
 *
 *     Quotation {クォーテーション/引用符}
 *         You can use double quote. "..." Do not use single quote. '...'
 *         {二重引用符が使用できる。一重引用符は使用してはいけない。}
 *
 *     Escape chacter {エスケープ文字}
 *         You can use escape character in JSON specification.
 *         {JSON仕様内のエスケープ文字が使用できる。}
 *
 *         \" \\ \/ \b \f \n \r \t \uXXXX
 *
 *     Hierarchical structure of section {セクションの階層構造}
 *         You can use dot "." section separator. You can change.
 *         {セクション区切りにはドット"."が使用できる。変更可能。}
 *
 * @see http://www.json.org/
 * @see http://www.json.org/json-ja.html
 */

var LINE_SEPARATOR = '\r\n';
var DOUBLE_QUOTE = '"';
var sectionSeparator = '.';


//######################################################################
/**
 * function: stringify to ini file.
 * @param obj Object (required)
 * @param key String (optional)
 * @param section String (optional)
 */
function toIniFile(obj, key, section) {
  if (typeof key === 'undefined') key = '';
  if (typeof section === 'undefined') section = '';
  var strIniFile = '';
  var nextSection;

  if (section === '' && key === '')
    nextSection = typeOf(obj);
  else if (section === '')
    nextSection = key;
  else if (key === '')
    nextSection = section;
  else
    nextSection = section + sectionSeparator + key;

  switch (typeOf(obj)) {
  case 'Number':
  case 'Boolean':
  case 'Null':
  case 'Undefined':
  case 'String':
    if (key === '') {
      strIniFile += '[' + nextSection + ']' + LINE_SEPARATOR + 'value';
    } else {
      strIniFile += key;
    }
    strIniFile += '='+ toValueString(obj) + LINE_SEPARATOR;
    break;
  case 'Object':
  case 'Array':
    var simpleObj = {}; // NUMBER, BOOLEAN, NULL, STRING
    var complexObj = {}; // ARRAY, OBJECT
    for (var k in obj) {
      switch (typeOf(obj[k])) {
      case 'Number':
      case 'Boolean':
      case 'Null':
      case 'Undefined':
      case 'String':
        simpleObj[k] = obj[k];
        break;
      case 'Object':
      case 'Array':
        complexObj[k] = obj[k];
        break;
      default:
        throw new Error('toIniFile(): Not Supported: type: ' + typeOf(obj[k]));
      }
    }

    if (Object.keys(simpleObj).length != 0 || Object.keys(complexObj).length == 0) {
      strIniFile += '[' + nextSection + ']' + LINE_SEPARATOR;

      for (var k in simpleObj)
        strIniFile += toIniFile(simpleObj[k], k, nextSection);
    }

    if (section === '' && key === '')
      nextSection = '';
    else if (section === '')
      nextSection = key;
    else
      nextSection = section + sectionSeparator + key;

    for (var k in complexObj) {
      strIniFile += toIniFile(complexObj[k], k, nextSection);
    }
    break;
  default:
    throw new Error('toIniFile(): Not Supported: type: ' + typeOf(obj));
  }
  return strIniFile;
}
module.exports.toIniFile = exports.toIniFile = toIniFile;


//######################################################################
/**
 * function: to Value String.
 */
function toValueString(obj) {
  var result = '';
  var s1 = '' + obj;
  if (typeof s1 === 'string') s1 = s1.trim();
  var s2 = JSON.stringify(obj);
  if (s2 === DOUBLE_QUOTE + s1 + DOUBLE_QUOTE) {
    return s1;
    /*
    try {
      if (JSON.parse(s1) === obj)
        return s1;
      else
        return s2;
    } catch (e) {
      return s2;
    }
    */
  }
  else return s2;
}


//######################################################################
/**
 * function: parse ini file. INIファイルを読んでオブジェクトにする
 */
function parseIniFile(strIniFile) {
  var lines = strIniFile.split('\n');
  var section = '';
  var obj = {};
  var point = obj;
  for (var i in lines) {
    var line = lines[i].trim();
    var pos = 0;

    /* comment {コメント} */
    if (line === '') continue; // blank line {空行}
    if (line.slice(0, 1) === ';') continue; // line comment {行コメント}
    if (line.slice(0, 1) === '#') continue; // line comment {行コメント}

    if (line.slice(0, 1) === '[' && line.slice(-1) === ']') {
      /* section {セクション} */
      section = line.slice(1, -1).trim();
      var sections = section.split(sectionSeparator);
      point = obj;
      for (var j in sections) {
        if (!(sections[j] in point)) point[sections[j]] = {};
        point = point[sections[j]];
      }
    }
    else if ((pos = line.indexOf('=')) >= 0) {
      /* parameter {パラメータ} */
      var key = line.slice(0, pos).trim();
      var val = line.slice(pos + 1);
      try {
        if (val === 'true' || val === 'false' || val === 'null' ||
            val.slice(0, 1) === DOUBLE_QUOTE)
          val = JSON.parse(val);
        else
          val = val.trim();
      } catch (e) {
      }
      point[key] = val;
    }
    else {
      throw new Error('invalid parameter, line: ' + line);
      //console.log('\033[91mERROR\033[m');
    }
  }
  //var util = require('util');
  //console.log(util.inspect(obj,false,null,true));
  if (typeOf(obj) === 'Object' && Object.keys(obj).length === 1) {
    for (var k in obj) {
      if (typeOf(obj[k]) === 'Object' && Object.keys(obj[k]).length === 1 && 'value' in obj[k]) {
        if (typeOf(obj[k].value) === k) return obj[k].value;
        if (k === 'Undefined' && obj[k].value === 'undefined') return undefined;
      }
    }
  }
  return obj;
}
module.exports.parseIniFile = exports.parseIniFile = parseIniFile;


//######################################################################
/**
 * function: set section separator. {セクション区切りを設定}
 *
 * @param str String of section separator
 */
function setSectionSeparator(str) { sectionSeparator = str; }
module.exports.setSectionSeparator = exports.setSectionSeparator = setSectionSeparator;


//######################################################################
/**
 * function: get section separator. {セクション区切りを取得}
 *
 * @return String of section separator
 */
function getSectionSeparator() { return sectionSeparator; }
module.exports.getSectionSeparator = exports.getSectionSeparator = getSectionSeparator;


//######################################################################
/**
 * function typeOf. {型}
 *
 * @param obj JavaScript object {JavaScriptオブジェクト}
 * @return String type of object {オブジェクトの型を文字列で返す}
 *
 * @see http://qiita.com/items/465e715dae14e2f601de
 * @see http://bonsaiden.github.io/JavaScript-Garden/ja/#types.typeof
 *
 * function is(type, obj) { return type === typeOf(obj); }
 * function typeOf(obj) { return Object.prototype.toString.call(obj).slice(8, -1); }
 */
function typeOf(obj) { return Object.prototype.toString.call(obj).slice(8, -1); }
module.exports.typeOf = exports.typeOf = typeOf;
