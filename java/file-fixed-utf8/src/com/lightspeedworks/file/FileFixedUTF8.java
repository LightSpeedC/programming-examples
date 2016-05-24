package com.lightspeedworks.file;

import java.math.BigDecimal;

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
	public byte[] aggregate(FieldDefs argFieldDefs, Object... objects) {
		FieldDef[] fieldDefs = argFieldDefs.fieldDefs;

		// 引数のチェック
		if (fieldDefs.length % 3 != 0)
			throw new IllegalArgumentException("fieldDefs引数の個数 " + fieldDefs.length
					+ " は3の倍数で指定");

		if (fieldDefs.length == 0)
			throw new IllegalArgumentException("fieldDefs引数は必須");

		if (fieldDefs.length != objects.length)
			throw new IllegalArgumentException("fieldDefs引数の個数 " + fieldDefs.length
					+ " はobjects引数の個数 " + objects.length);

		// buffのためのsizeを計算
		int size = 0;
		for (int i = 0; i < fieldDefs.length; ++i) {
			if (fieldDefs[i].type == FieldDefs.TYPEN)
				size += fieldDefs[i].length * 3;
			else
				size += fieldDefs[i].length;
		}

		// buffを用意
		byte[] buff = new byte[size];
		int pos = 0;

		// buffにセット
		for (int i = 0; i < objects.length; ++i) {
			Object obj = objects[i];
			char type = fieldDefs[i].type;
			int length = fieldDefs[i].length;

			if (obj == null && type == FieldDefs.TYPE9)
				type = FieldDefs.TYPEX;

			if (obj == null)
				obj = "";

			if (type == FieldDefs.TYPE9) {
				long val;
				if (obj instanceof String)
					val = Long.valueOf((String) obj);
				else if (obj instanceof Integer)
					val = (Integer) obj;
				else if (obj instanceof Long)
					val = (Long) obj;
				else if (obj instanceof BigDecimal)
					val = ((BigDecimal) obj).longValue();
				else
					val = (Long) obj;
				// else: Interger, Long, or Exception

				// マイナスの時は先頭に'-'を埋めて、残りをプラスとして処理
				if (val < 0) {
					pos = BufferUtil.fill(buff, pos, size, (byte) '-', 1);
					--length;
					val = (-val);
				}
				byte[] str2 = String.valueOf(val).getBytes();
				str2 = BufferUtil.padStart(str2, length, (byte) '0');
				pos = BufferUtil.copy(buff, pos, size, str2, 0, str2.length);
			}

			// X: 英数
			else if (type == FieldDefs.TYPEX) {
				byte[] str2 = ((String) obj).getBytes();
				str2 = BufferUtil.padEnd(str2, length, (byte) ' ');
				pos = BufferUtil.copy(buff, pos, size, str2, 0, str2.length);
			}

			// N: 日本語
			else if (type == FieldDefs.TYPEN) {
				length *= 3;
				byte[] str2 = ((String) obj).getBytes();
				str2 = BufferUtil.padEnd(str2, length, (byte) 0);
				pos = BufferUtil.copy(buff, pos, size, str2, 0, str2.length);
			}

			// ?
			else
				throw new IllegalArgumentException("TYPE? " + type);
		}

		if (pos != size)
			throw new RuntimeException("pos " + pos + " != size " + size);

		return buff;
	}
}
