package com.lightspeedworks.file;

public class FieldDef {

	/**
	 * TYPE9. 半角数字
	 */
	static char TYPE9 = '9'; // 半角数字
	/**
	 * TYPEX. 半角文字
	 */
	static char TYPEX = 'X'; // 半角文字
	/**
	 * TYPEN. 日本語(全角;漢字)
	 */
	static char TYPEN = 'N'; // 日本語(全角;漢字)

	char type; // 型 '9', 'X', 'N'
	int length; // 長さ
	String name; // 説明：項目名

	FieldDef(char type, int length, String name) {
		this.type = type;
		this.length = length;
		this.name = name;
	}
}
