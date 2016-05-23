package com.lightspeedworks.file;

public class FileFixedUTF8Main {

	public static void main(String[] args) {
		run1();
		run2();
	}

	static void run1() {
		// フィールド定義
		FieldDefs fieldDefs = new FieldDefs( //
				FieldDefs.TYPE9, 8, "数字", // xxx
				FieldDefs.TYPEX, 8, "英数", // xxx
				FieldDefs.TYPEN, 8, "日本語" // xxx
		);

		byte[] buff;

		buff = FileFixedUTF8.convert(fieldDefs, null, null, null);
		System.out.println(BufferUtil.dump(buff));

		buff = FileFixedUTF8.convert(fieldDefs, 123, "ABC", "漢字");
		System.out.println(BufferUtil.dump(buff));

		buff = FileFixedUTF8.convert(fieldDefs, -123, "XYZ", "漢字");
		System.out.println(BufferUtil.dump(buff));

		buff = FileFixedUTF8.convert(fieldDefs, "123", "ABC", "漢字");
		System.out.println(BufferUtil.dump(buff));

		buff = FileFixedUTF8.convert(fieldDefs, "-123", "XYZ", "漢字");
		System.out.println(BufferUtil.dump(buff));

		buff = FileFixedUTF8.convert(fieldDefs, 1234567890123456789L, "ABCDEFGHIJ", "漢字あいうえおかきくけこ");
		System.out.println(BufferUtil.dump(buff));

		buff = FileFixedUTF8.convert(fieldDefs, -1234567890123456789L, "ABCDEFGHIJ", "漢字あいうえおかきくけこ");
		System.out.println(BufferUtil.dump(buff));
	}

	static void run2() {
		// フィールド定義
		FieldDefs fieldDefs = new FieldDefs( //
				FieldDefs.TYPE9, 4, "数字", // xxx
				FieldDefs.TYPEX, 4, "英数", // xxx
				FieldDefs.TYPEN, 4, "日本語" // xxx
		);

		byte[] buff;

		buff = FileFixedUTF8.convert(fieldDefs, null, null, null);
		System.out.println(BufferUtil.dump(buff));

		buff = FileFixedUTF8.convert(fieldDefs, 123, "ABC", "漢字");
		System.out.println(BufferUtil.dump(buff));

		buff = FileFixedUTF8.convert(fieldDefs, -123, "XYZ", "漢字");
		System.out.println(BufferUtil.dump(buff));

		buff = FileFixedUTF8.convert(fieldDefs, "123", "ABC", "漢字");
		System.out.println(BufferUtil.dump(buff));

		buff = FileFixedUTF8.convert(fieldDefs, "-123", "XYZ", "漢字");
		System.out.println(BufferUtil.dump(buff));

		buff = FileFixedUTF8.convert(fieldDefs, 1234567890123456789L, "ABCDEFGHIJ", "漢字あいうえおかきくけこ");
		System.out.println(BufferUtil.dump(buff));

		buff = FileFixedUTF8.convert(fieldDefs, -1234567890123456789L, "ABCDEFGHIJ", "漢字あいうえおかきくけこ");
		System.out.println(BufferUtil.dump(buff));
	}

}
