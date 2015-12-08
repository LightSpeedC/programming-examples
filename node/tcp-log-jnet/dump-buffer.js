void function () {
	'use strict';

	module.exports = dumpBuffer;

	var fs = require('fs');
	var util = require('util');

	var unidata = fs.readFileSync('unicode-valid-japanese.txt').toString().split('\n').map(p => p.split(' ').map(c => parseInt(c, 16)));
	var uni = {};
	unidata.forEach(p => { for (var i = p[0]; i <= p[1]; ++i) uni[i] = true; });
	//console.log(JSON.stringify(uni, null, '  '))

	var NL = require('os').EOL;

	var N = 16;

	var utf16be = [[0, 0], [1, 0]];
	var utf16le = [[0, 0], [1, 0]];
	var utf8 = {n:0, p:0, x:0};

	function dumpBuffer(buf, dir) {
		if (!buf) return;
		if (!dir) dir = '';

		if (dir) wr(dir), wrNL();

		if (buf.length === 0) return wr('Buffer <>'), wrNL();

		function flush() {
			if (utf8.n > 0 && utf8.n === utf8.p) //OK
				;
			utf8.n = utf8.p = utf8.x = 0;
		}

		for (var j = 0, n = buf.length; j < n; j += N) {
			wr(('0000' + j.toString(16)).slice(-5, -1) + ':');

			// hex
			for (var i = 0; i < N; ++i) {
				if (i + j < n) {
					var c = buf[i + j];
					var s = ('0' + c.toString(16)).slice(-2);
					if (c >= 0x20 && c <= 0x7e) wr(' ' + s);
					else if (c >= 0xa1 && c <= 0xdf) wr(' \x1b[42m' + s + '\x1b[m');
					else if (c === 0x0d) wr(' \x1b[41m' + s + '\x1b[m');
					else if (c === 0x0a) wr(' \x1b[42m' + s + '\x1b[m');
					else if (c === 0x00) wr(' \x1b[44m' + s + '\x1b[m');
					else if (c === 0x7f) wr(' \x1b[44m' + s + '\x1b[m');
					else if (c < 0x20) wr(' \x1b[45m' + s + '\x1b[m');
					else wr(' \x1b[46m' + s + '\x1b[m');
				}
				else wr(' \x1b[44;30m**\x1b[m');
			}
			wr('  ');

			// 1 byte char
			for (var i = 0; i < N; ++i) {
				if (i + j < n) {
					var c = buf[i + j];
					if (c >= 0x20 && c <= 0x7e) wr(String.fromCharCode(c));
					else if (c >= 0xa1 && c <= 0xdf) wr('\x1b[42m' + String.fromCharCode(c + 0xff61 - 0xa1) + '\x1b[m');
					else if (c === 0x0d) wr('\x1b[41mr\x1b[m');
					else if (c === 0x0a) wr('\x1b[42mn\x1b[m');
					else if (c === 0x00) wr('\x1b[44m.\x1b[m');
					else if (c === 0x7f) wr('\x1b[44mx\x1b[m');
					else if (c < 0x20) wr('\x1b[45m' + String.fromCharCode(c + 0x40) + '\x1b[m');
					else wr('\x1b[46m*\x1b[m');
				}
				else wr('\x1b[44;30m*\x1b[m');
			}
			wr('  ');

/*
			wr('(');
			// 1～4 bytes char UTF8
			for (var i = 0; i < N; ++i) {
				if (i + j < n) {
					var c = buf[i + j];

					// 1 byte code
					if (c < 0x80) {
						flush();
						utf8.x = c;
						utf8.n = 1;
						utf8.p = 1;
					}

					else if (c < 0xc0) {
						utf8.x = (utf8.x << 6) | c & 0x3f;
						utf8.p++;
					}

					// C0 or C1 is error, F8-FD is also 5 or 6 bytes code
					else if (c < 0xc2 || c >= 0xf8 && c < 0xfe) {
						flush();
						utf8.x = c;
						utf8.n = 1;
						utf8.p = 1;
					}

					// 2 bytes code
					else if (c < 0xe0) {
						flush();
						utf8.x = c & 0x1f;
						utf8.n = 2;
						utf8.p = 1;
					}

					// 3 byres code
					else if (c < 0xf0) {
						flush();
						utf8.x = c & 0x0f;
						utf8.n = 3;
						utf8.p = 1;
					}

					// 4 bytes code, surrogate pair
					else if (code < 0xf8) {
						flush();
						utf8.x = c & 0x07;
						utf8.n = 4;
						utf8.p = 1;
					}

					else {
					// BOM 0xfe,0xff
						if (utf8.x === 0xfe && c === 0xff) ;
						else if (utf8.x === 0xff && c === 0xfe) ;
						else ???
					}


					if (utf8[0]) {
						if (c >= 0x20 && c <= 0x7e) wr(' ' + String.fromCharCode(c));
						else if (c >= 0xa1 && c <= 0xdf) wr('\x1b[42m ' + String.fromCharCode(c + 0xff61 - 0xa1) + '\x1b[m');
						else if (c === 0x0d) wr('\x1b[41m\\r\x1b[m');
						else if (c === 0x0a) wr('\x1b[42m\\n\x1b[m');
						else if (c === 0x00) wr('\x1b[44m..\x1b[m');
						else if (c === 0x7f) wr('\x1b[44m<x\x1b[m');
						else if (c < 0x20) wr('\x1b[45m^' + String.fromCharCode(c + 0x40) + '\x1b[m');
						else if (uni[c]) wr(String.fromCodePoint(c));
						else wr('\x1b[46m**\x1b[m');
					}
					utf8[0] = buf[i + j];
					utf8[1]
				}
				else wr('\x1b[44;30m*\x1b[m');
			}
			wr(')');
			wr(' ');
*/

			// 2 bytes char UTF16BE[k]
			for (var k = 0; k < 2; ++k) {
				for (var i = 0; i < N; ++i) {
					if (i + j < n) {
						if (utf16be[k][0]) {
							var c = (utf16be[k][1] << 8) | buf[i + j];
							//console.log(uni[c])// && '漢' === String.fromCodePoint(c));
							if (c >= 0x20 && c <= 0x7e) wr(' ' + String.fromCharCode(c));
							else if (c >= 0xa1 && c <= 0xdf) wr('\x1b[42m ' + String.fromCharCode(c + 0xff61 - 0xa1) + '\x1b[m');
							else if (c === 0x0d) wr('\x1b[41m\\r\x1b[m');
							else if (c === 0x0a) wr('\x1b[42m\\n\x1b[m');
							else if (c === 0x00) wr('\x1b[44m..\x1b[m');
							else if (c === 0x7f) wr('\x1b[44m<x\x1b[m');
							else if (c < 0x20) wr('\x1b[45m^' + String.fromCharCode(c + 0x40) + '\x1b[m');
							//else if (c === 0x30fb) wr('・');
							else if (uni[c]) wr((c >= 0xff61 && c <= 0xff9f ? ' ' : '') + String.fromCodePoint(c));
							else wr('\x1b[46m**\x1b[m');
						}
						utf16be[k][1] = buf[i + j];
						utf16be[k][0] ^= 1;
					}
					else wr('\x1b[44;30m*\x1b[m');
					//else wr((i + j === n && !utf16be[k][0] ? ' ' : '') + '\x1b[44;30m*\x1b[m');
				}
				wr(' \t');
				//wr(' ');
			}

/*
			// 2 bytes char UTF16LE[k]
			for (var k = 0; k < 2; ++k) {
				for (var i = 0; i < N; ++i) {
					if (i + j < n) {
						if (utf16le[k][0]) {
							var c = (buf[i + j] << 8) | utf16le[k][1];
							if (c >= 0x20 && c <= 0x7e) wr(' ' + String.fromCharCode(c));
							else if (c >= 0xa1 && c <= 0xdf) wr('\x1b[42m ' + String.fromCharCode(c + 0xff61 - 0xa1) + '\x1b[m');
							else if (c === 0x0d) wr('\x1b[41m\\r\x1b[m');
							else if (c === 0x0a) wr('\x1b[42m\\n\x1b[m');
							else if (c === 0x00) wr('\x1b[44m..\x1b[m');
							else if (c === 0x7f) wr('\x1b[44m<x\x1b[m');
							else if (c < 0x20) wr('\x1b[45m^' + String.fromCharCode(c + 0x40) + '\x1b[m');
							//else if (c === 0x30fb) wr('・');
							else if (uni[c]) wr((c >= 0xff61 && c <= 0xff9f ? ' ' : '') + String.fromCodePoint(c));
							else wr('\x1b[46m**\x1b[m');
						}
						utf16le[k][1] = buf[i + j];
						utf16le[k][0] ^= 1;
					}
					else wr('\x1b[44;30m*\x1b[m');
					//else wr((i + j === n && !utf16le[k][0] ? ' ' : '') + '\x1b[44;30m*\x1b[m');
				}
				wr(' \t');
			}
*/

			wrNL();
		}

	}

	var msg = '';
	function wr(x) {
		msg += x;
		//process.stdout.write(x);
	}

	function wrNL() {
		process.stdout.write(msg + NL);
		msg = '';
	}

	dumpBuffer.wr = wr;
	dumpBuffer.wrNL = wrNL;
}();
