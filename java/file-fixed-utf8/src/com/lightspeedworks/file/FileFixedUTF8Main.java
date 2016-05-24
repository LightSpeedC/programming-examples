package com.lightspeedworks.file;

public class FileFixedUTF8Main {

	private FileFixedUTF8 fileFixedUTF8 = new FileFixedUTF8();

	public static void main(String[] args) {
		FileFixedUTF8Main main = new FileFixedUTF8Main();
		main.run1();
		main.run2();
	}

	void run1() {
		// フィールド定義
		FieldDefs fieldDefs = new FieldDefs( //
				FieldDefs.TYPE9, 8, "数字", //
				FieldDefs.TYPEX, 8, "英数", //
				FieldDefs.TYPEN, 8, "日本語" //
		);

		byte[] buff;

		buff = fileFixedUTF8.aggregate(fieldDefs, null, null, null);
		System.out.println(BufferUtil.dump(buff));

		buff = fileFixedUTF8.aggregate(fieldDefs, 123, "ABC", "漢字");
		System.out.println(BufferUtil.dump(buff));

		buff = fileFixedUTF8.aggregate(fieldDefs, -123, "XYZ", "漢字");
		System.out.println(BufferUtil.dump(buff));

		buff = fileFixedUTF8.aggregate(fieldDefs, "123", "ABC", "漢字");
		System.out.println(BufferUtil.dump(buff));

		buff = fileFixedUTF8.aggregate(fieldDefs, "-123", "XYZ", "漢字");
		System.out.println(BufferUtil.dump(buff));

		buff = fileFixedUTF8.aggregate(fieldDefs, 1234567890123456789L,
				"ABCDEFGHIJ", "漢字あいうえおかきくけこ");
		System.out.println(BufferUtil.dump(buff));

		buff = fileFixedUTF8.aggregate(fieldDefs, -1234567890123456789L,
				"ABCDEFGHIJ", "漢字あいうえおかきくけこ");
		System.out.println(BufferUtil.dump(buff));
	}

	void run2() {
		// フィールド定義
		FieldDefs fieldDefs = new FieldDefs( //
				FieldDefs.TYPE9, 4, "数字", //
				FieldDefs.TYPEX, 4, "英数", //
				FieldDefs.TYPEN, 4, "日本語" //
		);

		byte[] buff;

		buff = fileFixedUTF8.aggregate(fieldDefs, null, null, null);
		System.out.println(BufferUtil.dump(buff));

		buff = fileFixedUTF8.aggregate(fieldDefs, 123, "ABC", "漢字");
		System.out.println(BufferUtil.dump(buff));

		buff = fileFixedUTF8.aggregate(fieldDefs, -123, "XYZ", "漢字");
		System.out.println(BufferUtil.dump(buff));

		buff = fileFixedUTF8.aggregate(fieldDefs, "123", "ABC", "漢字");
		System.out.println(BufferUtil.dump(buff));

		buff = fileFixedUTF8.aggregate(fieldDefs, "-123", "XYZ", "漢字");
		System.out.println(BufferUtil.dump(buff));

		buff = fileFixedUTF8.aggregate(fieldDefs, 1234567890123456789L,
				"ABCDEFGHIJ", "漢字あいうえおかきくけこ");
		System.out.println(BufferUtil.dump(buff));

		buff = fileFixedUTF8.aggregate(fieldDefs, -1234567890123456789L,
				"ABCDEFGHIJ", "漢字あいうえおかきくけこ");
		System.out.println(BufferUtil.dump(buff));
	}

	void run837Y() {
		// フィールド定義
		FieldDefs fieldDefs = new FieldDefs( //
				FieldDefs.TYPEX, 4, "電文ID", // 837Y
				FieldDefs.TYPE9, 2, "対象となる人数", "1回数", // .. 繰り返し回数
				FieldDefs.TYPEX, 5, "市町村コード", // ............. 繰り返し対象外!! 殺す!
				FieldDefs.TYPEX, 11, "住民票コード", "1対象", // ... 繰り返し対象
				FieldDefs.TYPEX, 12, "個人番号", "1対象", // ....... 繰り返し対象
				FieldDefs.TYPEX, 2, "フッタ");

		byte[] buff;

		buff = fileFixedUTF8.aggregate(fieldDefs, //
				"837Y", // 電文ID
				2, // 繰り返し回数
				"10203", // 市町村コード
				new Objects( // 対象者
						new Objects("コード1", "番号1"), //
						new Objects("コード2", "番号2") //
				), "$\n");
		System.out.println(BufferUtil.dump(buff));

		buff = fileFixedUTF8.aggregate(fieldDefs, //
				"837Y", // 電文ID
				2, // 繰り返し回数
				"10203", // 市町村コード
				new Object[] { // 対象者
						new Object[] {"コード1", "番号1"}, //
						new Object[] {"コード2", "番号2"} //
				}, "$\n");
		System.out.println(BufferUtil.dump(buff));
	}
}
