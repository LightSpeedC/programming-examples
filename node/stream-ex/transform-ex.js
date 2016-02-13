// transform-ex.js

// http://www.slideshare.net/shigeki_ohtsu/stream2-kihon

// definition (destructive example - do not use)

var Transform = require('stream').Transform;

Transform.prototype._transform = function(chunk, encoding, cb) {
	for(var i = 0; i < chunk.length; i++)
		chunk[i]++;
	this.push(chunk);
	cb();
};

Transform.prototype._flush = function(cb) {
	this.push(new Buffer('[EOF]'));
	cb();
};


// using Transform
var tstream = new Transform();

var data = '';

tstream.on('readable', function() {
	var b = tstream.read();
	if (b) data += b;
});

tstream.on('end', function() {
	console.log('transformed = ' + data);
});

tstream.write(new Buffer('`abc'));
tstream.end(new Buffer('def'));
