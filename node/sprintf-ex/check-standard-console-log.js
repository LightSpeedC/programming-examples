	for (var c = 'a', z = 'z'; c <= z; c = String.fromCharCode(c.codePointAt(0) + 1)) {
		console.log('%%' + c + ' %' + c + ' %' + c + ' %' + c + ' %' + c + ' : ',
			'string', 123, true, {x:1,y:'2'});
	}
