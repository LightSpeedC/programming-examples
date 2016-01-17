function Class() {
	this.name = 'name ' + (Math.random() * 100 | 0);
	console.log(this);
}
if (new Class() === new Class()) throw new Error('new objects are same');

var singleton = null;
function Singleton() {
	if (singleton) {
		console.log('2nd:', singleton);
		return singleton;
	}
	singleton = this;
	this.name = 'Singleton';
	console.log('1st:', this);
}
if (new Singleton() !== new Singleton()) throw new Error('new objects are not same');
