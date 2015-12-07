void function () {
	'use strict';

	module.exports = dumpBuffer;

	var N = 16;

	var c1 = 0, c2 = 0;

	function dumpBuffer(buf, dir) {
		if (!buf) return;
		if (!dir) dir = '';

		if (buf.length === 0) return wr('Buffer <>\r\n');

		for (var j = 0, n = buf.length; j < n; j += N) {
			wr(dir + ('000' + j.toString(16)).slice(-4) + ':');
			for (var i = 0; i < N; ++i) {
				var c = i + j < n ? buf[i + j] : '.'.charCodeAt(0);
				var s = ('0' + c.toString(16)).slice(-2);
				if (i + j < n)
					if (c >= 0x20 && c <= 0x7e) wr(' ' + s);
					else if (c === 0x0d) wr(' \x1b[41m' + s + '\x1b[m');
					else if (c === 0x0a) wr(' \x1b[42m' + s + '\x1b[m');
					else wr(' \x1b[43m' + s + '\x1b[m');
				else wr(' \x1b[44;30m**\x1b[m');
			}
			wr('  ');
			for (var i = 0; i < N; ++i) {
				var c = i + j < n ? buf[i + j] : '.'.charCodeAt(0);
				if (i + j < n)
					if (c >= 0x20 && c <= 0x7e) wr(String.fromCharCode(c));
					else if (c === 0x0d) wr('\x1b[41mr\x1b[m');
					else if (c === 0x0a) wr('\x1b[42mn\x1b[m');
					else wr('\x1b[43m*\x1b[m');
				else wr('\x1b[44;30m*\x1b[m');
			}
			wr('  **\r\n');
		}

	}

	function wr(x) {
		process.stdout.write(x);
	}

	dumpBuffer.wr = wr;
}();
