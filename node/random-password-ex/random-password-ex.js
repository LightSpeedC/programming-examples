// nodeで8桁のパスワードを作ってみました

(function () {
	'use strict';

	var n = Number(process.argv[2] || 8);

	// Math.random().toString(36).substr(2, n)

	var seed = '0123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ';
	var len = seed.length;

	function genPwd(n) {
		do {
			var pwd = '';
			for (var i = 0; i < n; ++i)
				pwd += seed[Math.floor(Math.random()*len)];
			//console.log(pwd, 'ok?');
		} while (!checkPwd(pwd));
		//console.log(pwd, 'ok!');
		return pwd;
	}

	function checkPwd(pwd) {
		if (pwd.length < n) return false;
		if (!pwd.match(/.*[0-9]/)) return false;
		//console.log(pwd, '0-9 OK');
		if (!pwd.match(/.*[A-Z]/)) return false;
		//console.log(pwd, 'A-Z OK');
		if (!pwd.match(/.*[a-z]/)) return false;
		//console.log(pwd, 'a-z OK');
		return true;
	}

	for (var i = 0; i < 20; ++i)
		console.log(genPwd(n));

})();
