function Foo() {
	console.log('new.target:', typeof new.target);
	console.log('new.target.name:', new.target && new.target.name);
	if (!new.target) throw "Foo() must be called with new";
	console.log("Foo instantiated with new");
}

console.log();
new Foo(); // logs "Foo instantiated with new"
console.log();
Foo(); // throws "Foo() must be called with new"
console.log();
