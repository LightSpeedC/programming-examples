import m from 'mithril';
import button from 'polythene/button/button';
import dialog from 'polythene/dialog/dialog';
import card from 'polythene/card/card';
//import list from 'polythene/list/list';
import 'polythene/theme/theme'; // optional

const app = {
	view: function() {
		return m('div', [
			m(button, {
				label: 'Open dialog',
				raised: true,
				events: {
					onclick: () => {
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
