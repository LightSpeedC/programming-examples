module.exports = getDriveLetters;

const aa = require('aa');
const fs = require('fs');

function getDriveLetters() {
	return aa(function* () {
		const letters = new Array(26);
		for (let i = 0, n = 'A'.charCodeAt(0); i < 26; ++i)
			letters[i] = String.fromCharCode(n + i);
		return (yield letters.map(x => function* () {
			try {
				yield cb => fs.readdir(x + ':\\', cb);
			} catch (e) { return null; }
			return x;
		})).filter(x => x);
	});
}

if (require.main === module)
	getDriveLetters().then(list => console.log(list));
