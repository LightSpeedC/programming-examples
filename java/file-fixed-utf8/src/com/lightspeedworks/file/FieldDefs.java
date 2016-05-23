package com.lightspeedworks.file;

public class FieldDefs {

	/**
	 * TYPE9. 半角数字
	 */
	public static char TYPE9 = '9'; // 半角数字
	/**
	 * TYPEN. 日本語(全角;漢字)
	 */
	public static char TYPEN = 'N'; // 日本語(全角;漢字)
	/**
	 * TYPEX. 半角文字
	 */
	public static char TYPEX = 'X'; // 半角文字

	/**
	 * fieldDefs. フィールド定義
	 */
	Object[] fieldDefs;

	/**
	 * FieldDefs. フィールド定義
	 *
	 * @param fieldDefs
	 */
	public FieldDefs(Object... fieldDefs) {
		if (fieldDefs.length % 3 != 0)
			throw new RuntimeException("引数の個数: " + fieldDefs.length);

		// 型のチェック
		for (int i = 0; i < fieldDefs.length; i += 3) {
			if (!(fieldDefs[i] instanceof Character))
				throw new RuntimeException("char?");
			if (!(fieldDefs[i + 1] instanceof Integer))
				throw new RuntimeException("int?");
			if (!(fieldDefs[i + 2] instanceof String))
				throw new RuntimeException("String?");
		}

		this.fieldDefs = fieldDefs;
	}

	/**
	 * FieldDefs. フィールド定義
	 *
	 * @return int[] フィールド定義
	 */
	public Object[] getFieldDefs() {
		return fieldDefs;
	}
}
