(function () {
	'use strict';

	console.log(eval('(x)=>x')(4));
	console.log(eval('(function*(){yield 5})().next().value'));
	console.log(Function('"use strict";var a=6;{let a=7;return a;}')());
	console.log(Function('"use strict";var a=6;{const a=8;return a;}')());

})();
