	var r = process.stdin;
	var buf = null, pos = 0;
	r.on('readable', onReadable);
	r.on('end', onEnd);
	var key = '', delim = ' ';
	console.log('{');
	function onLine(line) {
		if (line.startsWith('HKEY_CLASSES_ROOT\\.')) {
			key = line.substr(18);
		}
		else if (line.startsWith('    Content Type    REG_SZ    ')) {
			console.log(' ' + delim + ' ' + JSON.stringify(key) + ':\t' + JSON.stringify(line.substr(30)));
			delim = ',';
		}
	}

	function onEnd() {
		console.log('}');
		//console.log('end:', buf, pos);
	}

	function onReadable() {
		var b = r.read();
		if (!b) return;
		if (buf) buf = Buffer.concat([buf, b]);
		else buf = b;
		var p = buf.indexOf('\r\n', pos);

		for (;;) {
			if (p >= 0) {
				if (pos === p) onLine('');
				else onLine(buf.slice(pos, p).toString());
				pos = p + 2;
				if (buf.length >= pos) {
					buf = null;
					pos = 0;
					return;
				}
			}
			else {
				buf = buf.slice(pos);
				pos = 0;
				return;
			}
		} // for

	}
