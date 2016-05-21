package com.lightspeedworks.file;

public class FileFixedUTF8Main {

	public static void main(String[] args) {
		// TODO 自動生成されたメソッド・スタブ
		int[] fieldDefs = new int[] { BufferUtil.TYPE9, 8, // xxx
				BufferUtil.TYPEX, 8, // xxx
				BufferUtil.TYPEN, 8, // xxx
		};

		byte[] buff;

		buff = FileFixedUTF8.convert(fieldDefs, null, null, null);
		System.out.println(BufferUtil.dump(buff));

		buff = FileFixedUTF8.convert(fieldDefs, 123, "aaa", "漢字");
		System.out.println(BufferUtil.dump(buff));

		buff = FileFixedUTF8.convert(fieldDefs, null, null);
		System.out.println(BufferUtil.dump(buff));
	}

}
