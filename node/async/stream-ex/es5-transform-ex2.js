// transform-ex.js

// http://www.slideshare.net/shigeki_ohtsu/stream2-kihon

// definition

var Transform = require('stream').Transform;

require('util').inherits(TransformExample, Transform);

function TransformExample() {
	Transform.apply(this, arguments);
}

TransformExample.prototype._transform = function(chunk, encoding, cb) {
	for(var i = 0; i < chunk.length; i++) chunk[i]++;
	this.push(chunk);
	cb();
};

TransformExample.prototype._flush = function(cb) {
	this.push(new Buffer('[EOF]'));
	cb();
};


// using TransformExample
var tstream = new TransformExample();

var data = '';

tstream.on('readable', function() {
	var buff = tstream.read();
	if (buff) data += buff;
});

tstream.on('end', function() {
	console.log('transformed = ' + data);
});

tstream.write(new Buffer('`abc'));
tstream.end(new Buffer('def'));
