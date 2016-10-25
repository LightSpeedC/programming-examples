// config-local-storage.js

module.exports = Config;

// Config
function Config(key, value, version) {
	this.key = key;
	//this.version = version;
	this.value = value || {};
	this.load();
	//if (this.value.version !== version) {
	//	this.value = value || {};
	//	this.value.version = version
	//}
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
