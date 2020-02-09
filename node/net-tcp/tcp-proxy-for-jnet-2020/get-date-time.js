'use strict';

const DateTimeString = require('./date-time-string');

module.exports = { DateTimeString, getDateString, getTimeString };

function getDateString() {
	return DateTimeString.toDateString().replace(/-/g, '');
}

function getTimeString() {
	return DateTimeString.toTimeString().replace(/:/g, '').replace(/\./g, '-');
}
