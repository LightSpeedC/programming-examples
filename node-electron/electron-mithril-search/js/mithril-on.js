'use strict';

module.exports = function (m) {

	return mithril_on;

	// HTML要素のイベントと値にプロパティを接続するユーティリティ
	function mithril_on(eventName, propName, propFunc, attrs) {
		attrs = attrs || {};
		attrs['on' + eventName] = m.withAttr(propName, propFunc);
		attrs[propName] = propFunc();
		return attrs;
	}

};
