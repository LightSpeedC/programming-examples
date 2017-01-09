'use strict';

const stream = require('stream');
const {Readable, Writable} = stream;

/*
Readable - streams from which data can be read (for example fs.createReadStream()).
Writable - streams to which data can be written (for example fs.createWriteStream()).
Duplex - streams that are both Readable and Writable (for example net.Socket).
Transform - Duplex streams that can modify or transform the data as it is written and read (for example zlib.createDeflate()).

objectMode

Class: stream.Writable
	Event: 'close'
	Event: 'drain'
	Event: 'error'
	Event: 'finish'
	Event: 'pipe'
	Event: 'unpipe'
	writable.cork()
	writable.end([chunk][, encoding][, callback])
	writable.setDefaultEncoding(encoding)
	writable.uncork()
	writable.write(chunk[, encoding][, callback])

Class: stream.Readable
	Event: 'close'
	Event: 'data'
	Event: 'end'
	Event: 'error'
	Event: 'readable'
	readable.isPaused()
	readable.pause()
	readable.pipe(destination[, options])
	readable.read([size])
	readable.resume()
	readable.setEncoding(encoding)
	readable.unpipe([destination])
	readable.unshift(chunk)
	readable.wrap(stream)

	// readable.read(0)
	// readable.push('')

Class
	Method(s) to implement
Readable
	_read
Writable
	_write, _writev
Duplex - Reading and writing
	_read, _write, _writev
Transform - Operate on written data, then read the result
	_transform, _flush
*/
