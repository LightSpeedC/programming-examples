// config-local-storage.js

module.exports = Config;

// Config
function Config(key, value) {
	this.key = key;
	this.value = value || {};
	this.load();
}

// #load
Config.prototype.load = function load() {
	if (typeof localStorage[this.key] === 'undefined')
		this.save();
	this.value = JSON.parse(localStorage[this.key]);
}
// #save

Config.prototype.save = function save() {
	localStorage[this.key] = JSON.stringify(this.value);
	return this.value;
}
