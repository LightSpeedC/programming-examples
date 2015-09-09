// JavaScriptでカタカナをひらがなに変換する(その逆も)
// http://qiita.com/mimoe/items/855c112625d39b066c9a

// カタカナをひらがなに変換する
var str = '１２３漢字アイウあいう';
console.log(str, '→', kanaToHira(str));
// １２３漢字アイウあいう → １２３漢字あいうあいう

function kanaToHira(str) {
	return str.replace(/[\u30a1-\u30f6]/g, function(match) {
		var chr = match.charCodeAt(0) - 0x60;
		return String.fromCharCode(chr);
	});
}


// ひらがなをカタカナに変換する
var str = '１２３漢字アイウあいう';
console.log(str, '→', hiraToKana(str));
// １２３漢字アイウあいう → １２３漢字アイウアイウ

function hiraToKana(str) {
	return str.replace(/[\u3041-\u3096]/g, function(match) {
		var chr = match.charCodeAt(0) + 0x60;
		return String.fromCharCode(chr);
	});
}
