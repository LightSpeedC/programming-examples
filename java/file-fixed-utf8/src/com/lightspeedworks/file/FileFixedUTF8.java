package com.lightspeedworks.file;

import static com.lightspeedworks.file.FieldType.*;
// import static com.lightspeedworks.file.FieldType.*;

public class FileFixedUTF8 {

	public static byte[] convert(int[] fieldDefs, Object... objects) {
		if (fieldDefs.length % 2 != 0)
			throw new RuntimeException("fieldDefs引数は偶数個の整数で指定");
		if (fieldDefs.length == 0)
			throw new RuntimeException("fieldDefs引数は必須");
		if (fieldDefs.length != objects.length * 2)
			throw new RuntimeException("fieldDefs引数の個数はobjects引数の個数の倍");

		int i = 0;
		for (Object obj : objects) {
			System.out.println(obj);
			int typ = fieldDefs[i++];
			int len = fieldDefs[i++];
			if (obj == null && typ == TYPE9)
				typ = TYPEX;
			if (typ == TYPE9)
				;
			else if (typ == TYPEX)
				;
			else if (typ == TYPEN)
				;
			else
				;
		}
		return null;
	}

}
