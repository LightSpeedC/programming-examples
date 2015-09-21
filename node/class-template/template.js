this.Template = function () {

	var classPrivate1 = 'class    private 1';
	var privates1 = new WeakMap();
	var privates2 = new WeakMap();
	var privates  = new WeakMap();

	function Template() {
		this.public1 = 'instance public  1';
		privates1.set(this, 'instance private 1');
		privates2.set(this, 'instance private 2');
		privates.set(this, {
			privateA: 'instance private A',
			privateB: 'instance private B'
		});
	}

	Template.classPublic1 = 'class    public  1';

	Template.prototype.method1 = function method1() {
		this.public1 += ' 1';
		Template.classPublic1 += ' 1';

		privates1.get(this);
		privates1.set(this, privates1.get(this) + ' 1');

		privates2.get(this);
		privates2.set(this, privates2.get(this) + ' 2');

		var p = privates.get(this);
		p.privateA;
		p.privateA += ' A';

		p.privateB;
		p.privateB += ' B';

		classPrivate1;
		classPrivate1 += ' 1';

		console.log(this.public1);
		console.log(privates1.get(this));
		console.log(privates2.get(this));
		console.log(p.privateA);
		console.log(p.privateB);
		console.log(classPrivate1);
		console.log(Template.classPublic1);
	};

	Template.Template = Template;

	if (typeof module !== 'undefined' && module.exports)
		module.exports = Template;

	return Template;

}();
