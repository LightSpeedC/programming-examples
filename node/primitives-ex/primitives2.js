var oo = {x: 1, y: 2};
console.log('■oo+"":', oo + '', '■oo.toString():', oo.toString(), '■oo:', oo);
var os = {x: 1, y: 2, toString: toString};
console.log('■os+"":', os + '', '■os.toString():', os.toString(), '■os:', os);
var ov = {x: 1, y: 2, valueOf: valueOfNumber};
console.log('■ov+"":', ov + '', '■ov.toString():', ov.toString(), '■ov:', ov);
var ow = {x: 1, y: 2, valueOf: toString};
console.log('■ow+"":', ow + '', '■ow.toString():', ow.toString(), '■ow:', ow);
var ox = {x: 1, y: 2, valueOf: valueOfNumber, toString: toString};
console.log('■ox+"":', ox + '', '■ox.toString():', ox.toString(), '■ox:', ox);
console.log();

function Point(x, y) { this.x = x; this.y = y; }
Point.prototype.toString = toString;
//Point.prototype.valueOf = toString;
//Point.prototype.valueOf = toJSON;
//Point.prototype.valueOf = valueOfNumber;
Point.prototype.toJSON = toJSON;


var p1 = new Point(1, 2);
var p2 = new Point(1, 3);
console.log('■p1:', p1, '■p2:', p2);
console.log('■p1+"":', p1 + '', '■p2+"":', p2 + '');
console.log('■p1!=p2:', p1 != p2, '■p1!==p2:', p1 !== p2);
console.log('■p1==p2:', p1 == p2, '■p1===p2:', p1 === p2);
console.log('■p1>p2: ', p1 > p2,  '■p1<p2: ', p1 < p2);
console.log('■p1>=p2:', p1 >= p2, '■p1<=p2:', p1 <= p2);
console.log('■JSON p1:', JSON.stringify(p1), '■JSON p2:', JSON.stringify(p2));

function valueOfNumber() { return (1e3 * this.x + this.y) / 1e3; }
function toString() { return (this.constructor === Object ? '' : this.constructor.name + ' ') + '{' +
	Object.keys(this).filter(x => typeof this[x] !== 'function').map(x => x + ':' + this[x]).join(', ') + '}'; }
function toJSON() { return Object.keys(this).filter(x => typeof this[x] !== 'function')
	.reduce((x, y) => (x[y] = this[y], x), this.constructor === Object ? {} : {type: this.constructor.name}); }
