var m = require('mithril');
var button = require('polythene/button/button');
var dialog = require('polythene/dialog/dialog');
var card = require('polythene/card/card');
//var list = require('polythene/list/list');
require('polythene/theme/theme'); // optional

var app = {
	view: function() {
		return m('div', [
			m(button, {
				label: 'Open dialog',
				raised: true,
				events: {
					onclick: function () {
						dialog.show({
							title: 'Dialog title',
							body: 'some text'
						});
					}
				}
			}),
			m(card, {content: [
				{primary: {
					title: 'Primary title',
					subtitle: 'Subtitle'
				}},
				{text: {content: 'text2...'}},
				{primary: {
					title: 'Primary title',
					subtitle: 'Subtitle'
				}},
				{text: {content: 'text2...'}},
			]}),
			m(card, {content: [
				{primary: {
					title: 'Primary title',
					subtitle: 'Subtitle'
				}},
				{text: {content: 'text2...'}},
			]}),
			m(dialog)
		]);
	}
};

m.mount(document.body, app);
