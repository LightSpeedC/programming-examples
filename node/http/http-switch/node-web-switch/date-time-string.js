// date-time-string.js

// USAGE:

// var DateTime = require('date-time-string');
// var toDateTimeString = DateTime.toDateTimeString;
// var toDateString = DateTime.toDateString;
// var toTimeString = DateTime.toTimeString;

// DateTime.extendDateToDateTimeString();
// DateTime.extendDateToString();

// var toDateTimeString = require('date-time-string').toDateTimeString;
// var toDateString = require('date-time-string').toDateString;
// var toTimeString = require('date-time-string').toTimeString;

// require('date-time-string').extendDateToDateTimeString();
// require('date-time-string').extendDateToString();

(function () {
'use strict';

function pad2(n) { return n < 10 ? '0' + n : n; }
function pad3(n) { return n < 10 ? '00' + n : (n < 100 ? '0' + n : n); }


//######################################################################

// class Date : method toDateTimeString extension
// Date+Time 日付+時刻
function toDateTimeString(x) {
  x = x instanceof Date ? x : this instanceof Date ? this : new Date;
  return x.getFullYear() + '-' +
    pad2(x.getMonth() + 1) + '-' +
    pad2(x.getDate()) + ' ' +
    pad2(x.getHours()) + ':' +
    pad2(x.getMinutes()) + ':' +
    pad2(x.getSeconds()) + '.' +
    pad3(x.getMilliseconds());
}


//######################################################################

// Date 日付
function toDateString(x) {
  x = x instanceof Date ? x : this instanceof Date ? this : new Date;
  return x.getFullYear() + '-' +
    pad2(x.getMonth() + 1) + '-' +
    pad2(x.getDate());
}


//######################################################################

// Time 時刻
function toTimeString(x) {
  x = x instanceof Date ? x : this instanceof Date ? this : new Date;
  return pad2(x.getHours()) + ':' +
    pad2(x.getMinutes()) + ':' +
    pad2(x.getSeconds()) + '.' +
    pad3(x.getMilliseconds());
}


//######################################################################

var weekNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
// class Date : method toHttpDate extension
// Date+Time 日付+時刻
// "Thu, 01 Dec 1994 16:00:00 GMT"
function toHttpDate(x) {
  x = x instanceof Date ? x : this instanceof Date ? this : new Date;
  return weekNames[x.getUTCDay()] + ', ' +
    pad2(x.getUTCDate()) + ' ' +
    monthNames[x.getUTCMonth()] + ' ' +
    x.getUTCFullYear() + ' ' +
    pad2(x.getUTCHours()) + ':' +
    pad2(x.getUTCMinutes()) + ':' +
    pad2(x.getUTCSeconds()) + ' GMT';
}


//######################################################################

// class Date: extend method to*String()
function extendDateToDateTimeString() {
  Date.prototype.toDateTimeString = toDateTimeString;
  Date.prototype.toDateString     = toDateString;
  Date.prototype.toTimeString     = toTimeString;
  Date.prototype.toHttpDate       = toHttpDate;
}


//######################################################################

// class Date: extend method toString()
function extendDateToString() {
  Date.prototype.toString         = toDateTimeString;
}


//######################################################################

var DateTime = {
  toDateTimeString:           toDateTimeString,
  toDateString:               toDateString,
  toTimeString:               toTimeString,
  toHttpDate:                 toHttpDate,
  extendDateToDateTimeString: extendDateToDateTimeString,
  extendDateToString:         extendDateToString
};

// module exports
if (typeof module !== 'undefined')
  module.exports = DateTime;
else if (typeof window !== 'undefined')
  window.DateTime = DateTime;

})();
