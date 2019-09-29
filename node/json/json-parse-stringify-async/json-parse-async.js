'use strict';

module.exports = jsonParseAsync;

// jsonParseAsync *****************************************************************
async function jsonParseAsync(str) {
	if (typeof str !== 'string')
		throw new Error('parse error: type is not string');

	const len = str.length;
	let pos = 0;
	let c;

	const result = await jsonParseInternal();

	skipWhiteSpaces();
	if (pos < len) throw new Error('parse error: (' + pos + ') extra ' + str.substr(pos, 8));

	return result;

	function nextChar() {
		if (++pos < len) c = str.substr(pos, 1);
	}

	function nextCharForced(msg) {
		if (++pos >= len) throw new Error((msg ? msg + ': ' : '') + 'end of json stream');
		c = str.substr(pos, 1);
	}

	function skipWhiteSpaces() {
		while (pos < len &&
			(c = str.substr(pos, 1)) === ' ' ||
			c === '\t' || c === '\r' || c === '\n')
				++pos;
	}

	function jsonParsePos(n) {
		return '(' + pos + ') ' + str.substr(pos, n) + ' ' + str.charCodeAt(pos);
		//return '(' + pos + ') ' + str.substr(pos, n) + '\n' +
		//	'\t' + str.replace(/\s/g, ' ') + '\n' +
		//	'\t' + ' '.repeat(pos) + '^';
	}

	// https://www.json.org/json-ja.html
	async function jsonParseInternal() {
		skipWhiteSpaces();
		if (pos >= len) throw new Error('end of json stream');

		switch (c) {
			// null
			case 'n':
				if (str.substr(pos, 4) === 'null')
					return (pos = pos + 4), null;
				throw new Error('parse error: ' + jsonParsePos(4));

			// true: boolean
			case 't':
				if (str.substr(pos, 4) === 'true')
					return (pos = pos + 4), true;
				throw new Error('parse error: ' + jsonParsePos(4));

			// false: boolean
			case 'f':
				if (str.substr(pos, 5) === 'false')
					return (pos = pos + 5), false;
				throw new Error('parse error: ' + jsonParsePos(5));

			// "string"
			case '\"':
				for (let i = pos + 1; i < len; ++i) {
					c = str.substr(i, 1);
					switch (c) {
						case '\\':
							++i; // skip escape
							continue;
						case '\"':
							const result = JSON.parse(str.substring(pos, i + 1));
							return (pos = i + 1), result;
						default:
							continue;
					}
				}
				throw new Error('unreachable');

			// {object}
			case '{':
				const obj = {};
				++pos;

				skipWhiteSpaces();
				if (pos >= len) throw new Error('parse error: object not found: end of json stream');

				if (c === '}') return (pos = pos + 1), {};
				while (true) {
					skipWhiteSpaces();
					if (pos >= len) throw new Error('parse error: object key not found: end of json stream');

					if (c !== '"') throw new Error('parse error: object key is not string: ' + jsonParsePos(1));
					const key = await jsonParseInternal();
					if (typeof key !== 'string')
						throw new Error('parse error: object key type error: ' + typeof key);

					skipWhiteSpaces();
					if (pos >= len) throw new Error('parse error: object key not found: end of json stream');

					if (c !== ':') throw new Error('parse error: object no colon: ' + jsonParsePos(1));
					nextCharForced();

					obj[key] = await jsonParseInternal();
					skipWhiteSpaces();
					if (pos >= len) throw new Error('parse error: object value not found: end of json stream');

					if (c === ',') { ++pos; continue; }
					if (c === '}') return (pos = pos + 1), obj;
					throw new Error('parse error: object: ' + jsonParsePos(1));
				}

			// [array]
			case '[':
				const arr = [];
				++pos;

				skipWhiteSpaces();
				if (pos >= len) throw new Error('parse error: array not found: end of json stream');

				if (c === ']') return (pos = pos + 1), [];
				while (true) {
					arr.push(await jsonParseInternal());
					skipWhiteSpaces();
					if (pos >= len) throw new Error('end of json stream');

					if (c === ',') { ++pos; continue; }
					if (c === ']') return (pos = pos + 1), arr;
					throw new Error('parse error: array: ' + jsonParsePos(1));
				}

			// number
			default:
				const last = pos;

				if (c === '-') nextCharForced('parse error: number: minus');

				if (c >= '0' && c <= '9') {
					nextChar();
					while (pos < len && c >= '0' && c <= '9') nextChar();

					if (pos < len && c === '.') {
						nextCharForced('parse error: number: period');
						if (c >= '0' && c <= '9') {
							nextChar();
							while (pos < len && c >= '0' && c <= '9') nextChar();
						}
						else
							throw new Error('parse error: number: ' + jsonParsePos(1));
					}

					if (pos < len && (c === 'e' || c === 'E')) {
						nextCharForced();
						if (c === '+' || c === '-')
							nextCharForced();
						if (c >= '0' && c <= '9') {
							nextChar();
							while (pos < len && c >= '0' && c <= '9') nextChar();
						}
						else
							throw new Error('parse error: number: ' + jsonParsePos(1));
					}

					return JSON.parse(str.substring(last, pos));
				}
				else
					throw new Error('parse error: ' + jsonParsePos(4));
		}

		// throw new Error('NYI: not implemented yet');
	}

}
