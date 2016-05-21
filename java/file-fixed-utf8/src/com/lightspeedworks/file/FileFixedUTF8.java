package com.lightspeedworks.file;

/**
 * FileFixedUTF8.
 *
 * 固定長ファイル(UTF8)用
 */
public class FileFixedUTF8 {

	/**
	 * convert.
	 *
	 * @param fieldDefs
	 *            int[]
	 * @param objects
	 *            Object[]
	 * @return byte[]
	 */
	public static byte[] convert(int[] fieldDefs, Object... objects) {
		// 引数のチェック
		if (fieldDefs.length % 2 != 0)
			throw new RuntimeException("fieldDefs引数の個数 " + fieldDefs.length + " は偶数で指定");
		if (fieldDefs.length == 0)
			throw new RuntimeException("fieldDefs引数は必須");
		if (fieldDefs.length != objects.length * 2)
			throw new RuntimeException(
					"fieldDefs引数の個数 " + fieldDefs.length + " はobjects引数の個数 " + objects.length + " の倍");

		// buffのためのsizeを計算
		int size = 0;
		for (int i = 0; i < fieldDefs.length; i += 2) {
			int typ = fieldDefs[i];
			int len = fieldDefs[i + 1];
			size += len;
			if (typ == BufferUtil.TYPEN)
				size += len * 2;
		}

		// buffを用意
		byte[] buff = new byte[size];
		int pos = 0;

		// buffにセット
		int i = 0;
		for (Object obj : objects) {
			// System.out.print(obj);
			// System.out.print(", ");

			int typ = fieldDefs[i++];
			int len = fieldDefs[i++];

			if (obj == null && typ == BufferUtil.TYPE9)
				typ = BufferUtil.TYPEX;

			if (obj == null)
				obj = "";

			if (typ == BufferUtil.TYPE9) {
				long val;
				if (obj instanceof String)
					val = Integer.valueOf((String) obj);
				else if (obj instanceof Integer)
					val = (int) obj;
				else if (obj instanceof Long)
					val = (long) obj;
				else
					val = (long) obj;
				// else: Interger, Long, or Exception

				// マイナスの時は先頭に'-'を埋めて、残りをプラスとして処理
				if (val < 0) {
					pos = BufferUtil.fill(buff, pos, size, (byte) '-', 1);
					--len;
					val = (-val);
				}
				byte[] str2 = String.valueOf(val).getBytes();
				str2 = BufferUtil.padStart(str2, len, (byte) '0');
				pos = BufferUtil.copy(buff, pos, size, str2, 0, str2.length);
			} else if (typ == BufferUtil.TYPEX) {
				byte[] str2 = ((String) obj).getBytes();
				str2 = BufferUtil.padEnd(str2, len, (byte) ' ');
				pos = BufferUtil.copy(buff, pos, size, str2, 0, str2.length);
			} else if (typ == BufferUtil.TYPEN) {
				len *= 3;
				byte[] str2 = ((String) obj).getBytes();
				str2 = BufferUtil.padEnd(str2, len, (byte) 0);
				pos = BufferUtil.copy(buff, pos, size, str2, 0, str2.length);
			} else {
				throw new RuntimeException("TYPE? " + typ);
			}
		}
		if (pos != size)
			throw new RuntimeException("pos " + pos + " != size " + size);
		// System.out.println();
		return buff;
	}
}
