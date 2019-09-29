const fs = require('fs');

// フォルダを再帰的に削除
const dangerouslyRemoveAllFiles = file => {
	try {
		fs.statSync(file).isDirectory() ? (
			fs.readdirSync(file).map(nm => file + '/' + nm)
				.forEach(dangerouslyRemoveAllFiles),
			fs.rmdirSync(file)) : fs.unlinkSync(file);
	} catch (err) { console.error(err + ' '); }
}

// distフォルダを再帰的に削除
dangerouslyRemoveAllFiles('dist');
