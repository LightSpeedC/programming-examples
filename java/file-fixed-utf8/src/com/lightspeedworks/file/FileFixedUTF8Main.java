package com.lightspeedworks.file;

public class FileFixedUTF8Main {

	public static void main(String[] args) {
		run1();
		run2();
	}

	static void run1() {
		// フィールド定義
		int[] fieldDefs = new int[] { //
				BufferUtil.TYPE9, 8, // xxx
				BufferUtil.TYPEX, 8, // xxx
				BufferUtil.TYPEN, 8, // xxx
		};

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
		int[] fieldDefs = new int[] { //
				BufferUtil.TYPE9, 4, // xxx
				BufferUtil.TYPEX, 4, // xxx
				BufferUtil.TYPEN, 4, // xxx
		};

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
