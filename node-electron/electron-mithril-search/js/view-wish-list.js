'use strict';

module.exports = function (m) {

	return viewWishList;

	// やりたいことリスト表示
	function viewWishList() {
		const list = [
			'更新日付で範囲検索したい',
			'更新日付を表示したい',
			'検索ワードのハイライト表示',
			'ファイルの内容で検索したい',
			'Mithril v1系にバージョンアップ',
			'React v15版を作る',
			'JSX対応 TypeScript v2.4, Babel v6, Webpack v3対応',
			'更新速度をUP',
			'いろいろと実現した。後、やることは?',
		];
		return m('ul', list.map(x => m('li', x)));
	}

};
