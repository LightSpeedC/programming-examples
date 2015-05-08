/* json-lib.js */

'use strict';

/**
 * JSON Library. {JSONライブラリ}
 *
 * @author LightSpeedC (Kazuaki Nishizawa; 西澤 和晃)
 *
 * @see http://www.json.org/
 * @see http://www.json.org/json-ja.html
 */

var LINE_SEPARATOR = '\r\n';
var DOUBLE_QUOTE = '"';


//######################################################################
/**
 * function: stringify to JSON file.
 * @param obj Object (required)
 * @param widthForIndent Number (optional; 40)
 * @param indentString String (optional; "  ")
 * @param level Number (optional; 0)
 */
function stringify(obj, widthForIndent, indentString, level) {
  if (obj === null) return 'null';
  if (obj === undefined) return 'null';
  switch (typeof obj) {
    case 'number':
    case 'boolean':
      return '' + obj;
    case 'string':
      return JSON.stringify(obj);
    case 'object':
      break;
    default:
      return JSON.stringify(obj);
  }

  if (typeof widthForIndent === 'undefined') widthForIndent = 40;
  if (typeof indentString === 'undefined') indentString = '  ';
  if (typeof level === 'undefined') level = 0;

  if (obj instanceof Array) {
    // array

    var strList = [];
    var width = 0;

    for (var i = 0; i < obj.length; ++i) {
      var str = stringify(obj[i], widthForIndent, indentString, level + 1);
      strList.push(str);
      width += str.length + 2;
    }
    if (width == 0)
      width = 2;

    var delim = '';
    var indent = LINE_SEPARATOR;
    var buff = '[';
    var n = strList.length;

    if (widthForIndent >= 0 && width > widthForIndent) {
      for (var i = 0; i < level; ++i)
        indent += indentString;
      delim += indent;

      for (var i = 0; i < strList.length; ++i) {
        buff += delim + indentString+ strList[i];
        delim = ',' + indent;
      }

      if (n > 0)
        buff += indent;
    } else {
      for (var i = 0; i < strList.length; ++i) {
        buff += delim + strList[i];
        delim = ', ';
      }
    }

    return buff + ']';
  }
  else {
    // object

    var strList = [];
    var width = 0;

    for (var key in obj) {
      var str = JSON.stringify(key) + ': ' + stringify(obj[key], widthForIndent, indentString, level + 1);
      strList.push(str);
      width += str.length + 2;
    }
    if (width == 0)
      width = 2;

    var delim = '';
    var indent = LINE_SEPARATOR;
    var buff = '{';
    var n = strList.length;

    if (widthForIndent >= 0 && width > widthForIndent) {
      // do indent {インデントする場合}
      for (var i = 0; i < level; ++i)
        indent += indentString;
      delim += indent;

      for (var i = 0; i < strList.length; ++i) {
        buff += delim + indentString + strList[i];
        delim = ',' + indent;
      }

      if (n > 0)
        buff += indent;
    } else {
      // do not indent {インデントしない場合}
      for (var i = 0; i < strList.length; ++i) {
        buff += delim + strList[i];
        delim = ', ';
      }
    }

    return buff + '}';
  }
}
module.exports.stringify = exports.stringify = stringify;
