import m from 'mithril';
import button from 'polythene/button/button';
import dialog from 'polythene/dialog/dialog';
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
			m(dialog)
		]);
	}
};

m.mount(document.body, app);
