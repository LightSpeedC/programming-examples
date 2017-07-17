// config-local-storage.js

const Rexfer = require('./rexfer');

// Config
class Config {
	// コンストラクタ
	constructor(key, value) {
		this.key = key;
		this.value = value || {};
		this.load();
	}

	// load
	load() {
		if (typeof localStorage[this.key] === 'undefined')
			this.save();
		this.value = JSON.parse(localStorage[this.key]);
	}

	// save
	save() {
		localStorage[this.key] = JSON.stringify(this.value);
		return this.value;
	}

	// propValue
	propValue(closureValue, key) {
		const self = this;
		closureValue = typeof this.value[key] === 'undefined' ? closureValue : this.value[key];
		closureFunc(closureValue);
		return closureFunc;

		function closureFunc(x) {
			if (arguments.length > 0) {
				closureValue = x;
				self.value[key] = closureValue;
				self.save();
			}
			return closureValue;
		}
	}

	// propRexfer
	propRexfer(closureValue, key) {
		const self = this;
		closureValue = typeof this.value[key] === 'undefined' ? closureValue : this.value[key];
		closureFunc(closureValue);
		return closureFunc;

		function closureFunc(x) {
			if (arguments.length > 0) {
				closureValue = x;
				closureFunc.rexfer = closureValue ? new Rexfer(closureValue, 'i') : null;
				self.value[key] = closureValue;
				self.save();
			}
			return closureValue;
		}
	}

} // class Config

module.exports = Config;
