var mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost/test');
var Cat = mongoose.model('Cat', {name: String});
var kitty = new Cat({name: 'Zildjian'});
kitty.save(function (err) {
	console.log(err || 'meow');
});
