// @ts-check

// import * as deepl from 'deepl-node';
const deepl = require('deepl-node');

// DEEPL_API_KEY: your API key
const authKey = process.env.DEEPL_API_KEY || 'N/A';
if (authKey === 'N/A') {
	throw new Error('Environment variable DEEPL_API_KEY is not defined!!!');
}


const translator = new deepl.Translator(authKey);

main().catch(console.error);

async function main() {
	const srcText = 'Hello, world!';
	const result = await translator.translateText(srcText, null, 'ja');
	console.log(result.text);
	// こんにちは、世界よ！
}
