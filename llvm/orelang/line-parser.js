'use strict';

const {Transform} = require('stream');
const LF = 0x0A;

// Line Parser 行解析器
class LineParser extends Transform {
	// コンストラクタ
	constructor(options) {
		// super(Object.assign({ writableObjectMode: true }, options));
		super(options);
		this.list = [];
	}

	// トランスフォーム
	_transform(chunk, encoding, callback) {
		if (!chunk) return callback();
		if (!Buffer.isBuffer(chunk))
			chunk = Buffer.from(chunk);
		if (chunk.length === 0) return callback();

		this.list.push(chunk);
		if (chunk.indexOf(LF) < 0) return callback();

		if (this.list.length !== 1)
			chunk = Buffer.concat(this.list);

		let pos = 0, idx = 0;
		while ((idx = chunk.indexOf(LF, pos)) >= 0) {
			this.push(chunk.slice(pos, idx + 1));
			pos = idx + 1;
		}

		this.list = pos < chunk.length ? [chunk.slice(pos)] : [];
		callback();
	}

	// フラッシュ
	_flush(callback) {
		if (this.list.length > 0) {
			this.push(Buffer.concat(this.list));
			this.list = [];
		}
		callback();
	}
}

module.exports = LineParser;
