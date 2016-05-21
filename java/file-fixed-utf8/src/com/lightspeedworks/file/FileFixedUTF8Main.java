package com.lightspeedworks.file;

import static com.lightspeedworks.file.FieldType.*;
import static com.lightspeedworks.file.FileFixedUTF8.*;

public class FileFixedUTF8Main {

	public static void main(String[] args) {
		// TODO 自動生成されたメソッド・スタブ
		int[] fieldDefs = new int[] {
				TYPE9, 5, // xxx
				TYPEX, 10, // xxx
				TYPEN, 5, // xxx
		};

		byte[] buff = convert(fieldDefs, "aaa", null);
		System.out.println(buff);
	}

}
