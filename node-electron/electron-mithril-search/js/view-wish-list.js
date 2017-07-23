'use strict';

module.exports = function (m) {

	return viewWishList;

	// やりたいことリスト表示
	function viewWishList() {
		const list = [
			'更新日付で範囲検索したい',
			'更新日付を表示したい',
			'検索ワードのハイライト表示',
			'いろいろと実現した。後、やることは?',
		];
		return m('ul', list.map(x => m('li', x)));
	}

};
