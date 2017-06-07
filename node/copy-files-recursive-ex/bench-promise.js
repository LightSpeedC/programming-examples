'use strict';

require('./common-methods')
	(require('./common-aa')
		(Dummy));

function Dummy(setup) {
	return new Promise(setup);
}

require('./common-bench')(Dummy).bench('Promise');
