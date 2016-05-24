package com.lightspeedworks.file;

public class FieldDefs {

	/**
	 * TYPE9. 半角数字
	 */
	public static char TYPE9 = FieldDef.TYPE9; // 半角数字
	/**
	 * TYPEX. 半角文字
	 */
	public static char TYPEX = FieldDef.TYPEX; // 半角文字
	/**
	 * TYPEN. 日本語(全角;漢字)
	 */
	public static char TYPEN = FieldDef.TYPEN; // 日本語(全角;漢字)

	/**
	 * fieldDefs. フィールド定義
	 */
	FieldDef[] fieldDefs;

	/**
	 * FieldDefs. フィールド定義
	 * 
	 * @param fieldDefs
	 */
	public FieldDefs(Object... fieldDefs) {
		if (fieldDefs.length % 3 != 0)
			throw new RuntimeException("引数の個数: " + fieldDefs.length);

		this.fieldDefs = new FieldDef[fieldDefs.length / 3];

		// 型のチェック
		int j = 0;
		for (int i = 0; i < fieldDefs.length; i += 3) {
			if (!(fieldDefs[i] instanceof Character))
				throw new IllegalArgumentException("char?");
			if (!(fieldDefs[i + 1] instanceof Integer))
				throw new IllegalArgumentException("int?");
			if (!(fieldDefs[i + 2] instanceof String))
				throw new IllegalArgumentException("String?");

			this.fieldDefs[j++] = new FieldDef((Character) fieldDefs[i],
					(Integer) fieldDefs[i + 1], (String) fieldDefs[i + 2]);
		}
	}

//	/**
//	 * FieldDefs. フィールド定義
//	 * 
//	 * @return int[] フィールド定義
//	 */
//	public FieldDef[] getFieldDefs() {
//		return fieldDefs;
//	}
}
