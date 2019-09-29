void function () {
	'use strict';

	module.exports = DumpBuffer;

	var fs = require('fs');
	var util = require('util');

	var unidata = fs.readFileSync('unicode-valid-japanese.txt').toString().split('\n').map(p => p.split(' ').map(c => parseInt(c, 16)));
	var uni = {};
	unidata.forEach(p => { for (var i = p[0]; i <= p[1]; ++i) uni[i] = true; });
	//console.log(JSON.stringify(uni, null, '  '))

	var NL = require('os').EOL;
	var back = '\x08\x08\x08';

	function DumpBuffer() {
		this.N = 16;

		this.utf16be = [[0, 0], [1, 0]];
		this.utf16le = [[0, 0], [1, 0]];
		this.utf8 = {n:0, p:0, x:0};
		this.msg = '';
	}

	DumpBuffer.prototype.dump = function dump(buf, dir) {
		if (!buf) return;
		if (!dir) dir = '';

		if (dir) this.wr(dir), this.wrNL();

		if (buf.length === 0) return this.wr('Buffer <>'), this.wrNL();

		function flush() {
			if (this.utf8.n > 0 && this.utf8.n === this.utf8.p) //OK
				;
			this.utf8.n = this.utf8.p = this.utf8.x = 0;
		}

		for (var j = 0, n = buf.length; j < n; j += this.N) {
			this.wr(('0000' + j.toString(16)).slice(-5, -1) + ':');

			// hex
			for (var i = 0; i < this.N; ++i) {
				if (i + j < n) {
					var c = buf[i + j];
					var s = ('0' + c.toString(16)).slice(-2);
					if (c >= 0x20 && c <= 0x7e) this.wr(' ' + s);
					else if (c >= 0xa1 && c <= 0xdf) this.wr(' \x1b[42m' + s + '\x1b[m');
					else if (c === 0x0d) this.wr(' \x1b[41m' + s + '\x1b[m');
					else if (c === 0x0a) this.wr(' \x1b[42m' + s + '\x1b[m');
					else if (c === 0x00) this.wr(' \x1b[44m' + s + '\x1b[m');
					else if (c === 0x7f) this.wr(' \x1b[44m' + s + '\x1b[m');
					else if (c < 0x20) this.wr(' \x1b[45m' + s + '\x1b[m');
					else this.wr(' \x1b[46m' + s + '\x1b[m');
				}
				else this.wr(' \x1b[44;30m**\x1b[m');
			}
			//this.wr('  ');

			this.wr('\r\x1b[56C');

			// 1 byte char
			for (var i = 0; i < this.N; ++i) {
				if (i + j < n) {
					var c = buf[i + j];
					if (c >= 0x20 && c <= 0x7e) this.wr(String.fromCharCode(c));
					else if (c >= 0xa1 && c <= 0xdf) this.wr('\x1b[42m' + String.fromCharCode(c + 0xff61 - 0xa1) + '\x1b[m');
					else if (c === 0x0d) this.wr('\x1b[41mr\x1b[m');
					else if (c === 0x0a) this.wr('\x1b[42mn\x1b[m');
					else if (c === 0x00) this.wr('\x1b[44m.\x1b[m');
					else if (c === 0x7f) this.wr('\x1b[44mx\x1b[m');
					else if (c < 0x20) this.wr('\x1b[45m' + String.fromCharCode(c + 0x40) + '\x1b[m');
					else this.wr('\x1b[46m*\x1b[m');
				}
				else this.wr('\x1b[44;30m*\x1b[m');
			}
			//this.wr('   ');

/*
			this.wr('(');
			// 1～4 bytes char UTF8
			for (var i = 0; i < this.N; ++i) {
				if (i + j < n) {
					var c = buf[i + j];

					// 1 byte code
					if (c < 0x80) {
						flush();
						this.utf8.x = c;
						this.utf8.n = 1;
						this.utf8.p = 1;
					}

					else if (c < 0xc0) {
						this.utf8.x = (this.utf8.x << 6) | c & 0x3f;
						this.utf8.p++;
					}

					// C0 or C1 is error, F8-FD is also 5 or 6 bytes code
					else if (c < 0xc2 || c >= 0xf8 && c < 0xfe) {
						flush();
						this.utf8.x = c;
						this.utf8.n = 1;
						this.utf8.p = 1;
					}

					// 2 bytes code
					else if (c < 0xe0) {
						flush();
						this.utf8.x = c & 0x1f;
						this.utf8.n = 2;
						this.utf8.p = 1;
					}

					// 3 byres code
					else if (c < 0xf0) {
						flush();
						this.utf8.x = c & 0x0f;
						this.utf8.n = 3;
						this.utf8.p = 1;
					}

					// 4 bytes code, surrogate pair
					else if (code < 0xf8) {
						flush();
						this.utf8.x = c & 0x07;
						this.utf8.n = 4;
						this.utf8.p = 1;
					}

					else {
					// BOM 0xfe,0xff
						if (this.utf8.x === 0xfe && c === 0xff) ;
						else if (this.utf8.x === 0xff && c === 0xfe) ;
						else ???
					}


					if (this.utf8[0]) {
						if (c >= 0x20 && c <= 0x7e) this.wr(' ' + String.fromCharCode(c));
						else if (c >= 0xa1 && c <= 0xdf) this.wr('\x1b[42m ' + String.fromCharCode(c + 0xff61 - 0xa1) + '\x1b[m');
						else if (c === 0x0d) this.wr('\x1b[41m\\r\x1b[m');
						else if (c === 0x0a) this.wr('\x1b[42m\\n\x1b[m');
						else if (c === 0x00) this.wr('\x1b[44m..\x1b[m');
						else if (c === 0x7f) this.wr('\x1b[44m<x\x1b[m');
						else if (c < 0x20) this.wr('\x1b[45m^' + String.fromCharCode(c + 0x40) + '\x1b[m');
						else if (uni[c]) this.wr(String.fromCodePoint(c));
						else this.wr('\x1b[46m**\x1b[m');
					}
					this.utf8[0] = buf[i + j];
					this.utf8[1]
				}
				else this.wr('\x1b[44;30m*\x1b[m');
			}
			this.wr(')');
			this.wr(' ');
*/


			// 2 bytes char UTF16BE[k]
			for (var k = 0; k < 2; ++k) {
				this.wr(['\r\x1b[76C', '\r\x1b[97C'][k]);
				var fl = false;
				var bk = false;
				for (var i = 0; i < this.N; ++i) {
					if (i + j < n) {
						if (this.utf16be[k][0]) {
							if (i === 0) this.wr(back[0]), bk = true;
							var c = (this.utf16be[k][1] << 8) | buf[i + j];
							if (c >= 0x20 && c <= 0x7e) this.wr(' ' + String.fromCharCode(c));
							else if (c >= 0xa1 && c <= 0xdf) this.wr('\x1b[42m ' + String.fromCharCode(c + 0xff61 - 0xa1) + '\x1b[m');
							else if (c === 0x0d) this.wr('\x1b[41m\\r\x1b[m');
							else if (c === 0x0a) this.wr('\x1b[42m\\n\x1b[m');
							else if (c === 0x00) this.wr('\x1b[44m..\x1b[m');
							else if (c === 0x7f) this.wr('\x1b[44m<x\x1b[m');
							else if (c < 0x20) this.wr('\x1b[45m^' + String.fromCharCode(c + 0x40) + '\x1b[m');
							else if (c === 0x225b) this.wr(' ' + String.fromCodePoint(c));
							else if (uni[c]) this.wr((c >= 0xff61 && c <= 0xff9f ? ' ' : '') + String.fromCodePoint(c));
							else this.wr('**');
						}
						this.utf16be[k][1] = buf[i + j];
						this.utf16be[k][0] ^= 1;
					}
					else if (i + j === n) {
						if (this.utf16be[k][0])
							this.wr('*'), fl = true;
						this.wr('\x1b[44;30m*\x1b[m');
					}
					else this.wr('\x1b[44;30m*\x1b[m');
				}
				//if (this.utf16be[k][0] && !fl)
				//	this.wr('*');
				//if (this.utf16be[k][0] && bk)
				//	this.wr('*');
				//this.wr('    ');
			}

/*
			// 2 bytes char UTF16LE[k]
			for (var k = 0; k < 2; ++k) {
				for (var i = 0; i < this.N; ++i) {
					if (i + j < n) {
						if (this.utf16le[k][0]) {
							var c = (buf[i + j] << 8) | this.utf16le[k][1];
							if (c >= 0x20 && c <= 0x7e) this.wr(' ' + String.fromCharCode(c));
							else if (c >= 0xa1 && c <= 0xdf) this.wr('\x1b[42m ' + String.fromCharCode(c + 0xff61 - 0xa1) + '\x1b[m');
							else if (c === 0x0d) this.wr('\x1b[41m\\r\x1b[m');
							else if (c === 0x0a) this.wr('\x1b[42m\\n\x1b[m');
							else if (c === 0x00) this.wr('\x1b[44m..\x1b[m');
							else if (c === 0x7f) this.wr('\x1b[44m<x\x1b[m');
							else if (c < 0x20) this.wr('\x1b[45m^' + String.fromCharCode(c + 0x40) + '\x1b[m');
							else if (uni[c]) this.wr((c >= 0xff61 && c <= 0xff9f ? ' ' : '') + String.fromCodePoint(c));
							else this.wr('\x1b[46m**\x1b[m');
						}
						this.utf16le[k][1] = buf[i + j];
						this.utf16le[k][0] ^= 1;
					}
					else this.wr('\x1b[44;30m*\x1b[m');
					//else this.wr((i + j === n && !this.utf16le[k][0] ? ' ' : '') + '\x1b[44;30m*\x1b[m');
				}
				this.wr(' \t');
			}
*/

			this.wrNL();
		}

	};

	DumpBuffer.prototype.wr = function wr(x) {
		this.msg += x;
		//process.stdout.write(x);
	};

	DumpBuffer.prototype.wrNL = function wrNL() {
		process.stdout.write(this.msg + NL);
		this.msg = '';
	};

}();
