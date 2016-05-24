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

		buff = fileFixedUTF8.aggregate(fieldDefs, 1234567890123456789L, "ABCDEFGHIJ", "漢字あいうえおかきくけこ");
		System.out.println(BufferUtil.dump(buff));

		buff = fileFixedUTF8.aggregate(fieldDefs, -1234567890123456789L, "ABCDEFGHIJ", "漢字あいうえおかきくけこ");
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

		buff = fileFixedUTF8.aggregate(fieldDefs, 1234567890123456789L, "ABCDEFGHIJ", "漢字あいうえおかきくけこ");
		System.out.println(BufferUtil.dump(buff));

		buff = fileFixedUTF8.aggregate(fieldDefs, -1234567890123456789L, "ABCDEFGHIJ", "漢字あいうえおかきくけこ");
		System.out.println(BufferUtil.dump(buff));
	}

}
