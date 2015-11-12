// nodeで8桁のパスワードを作ってみました

(function () {
	'use strict';

	var n = Number(process.argv[2] || 8);

	// Math.random().toString(36).substr(2, n)

	var seed = '0123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ';
	var len = seed.length;

	function genPwd(n) {
		var pwd = '';
		for (var i = 0; i < n; ++i)
			pwd += seed[Math.floor(Math.random()*len)];
		return pwd;
	}

	for (var i = 0; i < 20; ++i)
		console.log(genPwd(n));

})();
