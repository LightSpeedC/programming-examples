void function () {
	'use struct';

	sleep(500, 'a',
		(err, val) => chk(err) || sleep(500, 'b',
			(err, val) => chk(err) || sleep(500, 'c',
				(err, val) => chk(err) || sleep(500, 'd', chk)
			)
		)
	);

	function sleep(ms, val, cb) {
		console.log('sleep', ms, val);
		setTimeout(cb, ms, null, val);
	}

	function chk(err) {
		if (err) console.error(err);
		return err;
	}

} ();
