package com.lightspeedworks.file;

public class BufferUtil {

	/**
	 * 9: 半角数字
	 */
	public static int TYPE9 = '9';
	/**
	 * N: 日本語(全角;漢字)
	 */
	public static int TYPEN = 'N';
	/**
	 * X: 半角文字
	 */
	public static int TYPEX = 'X';

	/**
	 * copy.
	 *
	 * コピー
	 *
	 * @param buff
	 * @param pos
	 * @param limit
	 * @param str
	 * @param start
	 * @param size
	 * @return pos
	 */
	static int copy(byte[] buff, int pos, int limit, byte[] str, int start, int size) {
		for (int i = 0; i < size; ++i) {
			if (pos >= limit)
				return pos;
			buff[pos++] = str[start++];
		}
		return pos;
	}

	/**
	 * fill.
	 *
	 * fill文字を追加する
	 *
	 * @param buff
	 * @param pos
	 * @param limit
	 * @param fill
	 * @param size
	 * @return pos
	 */
	static int fill(byte[] buff, int pos, int limit, byte fill, int size) {
		for (int i = 0; i < size; ++i) {
			if (pos >= limit)
				return pos;
			buff[pos++] = fill;
		}
		return pos;
	}

	/**
	 * padEnd.
	 *
	 * @param str
	 * @param len
	 * @param fill
	 * @return byte[]
	 */
	static byte[] padEnd(byte[] str, int len, byte fill) {
		if (str.length > len)
			return subbyte(str, 0, len);

		byte[] buff = new byte[len];
		int pos = copy(buff, 0, len, str, 0, str.length);
		fill(buff, pos, len, fill, len - str.length);
		return buff;
	}

	/**
	 * padEnd.
	 *
	 * @param str
	 * @param len
	 * @param fill
	 * @return String
	 */
	static String padEnd(String str, int len, char fill) {
		if (str.length() > len)
			return str.substring(0, len);

		StringBuilder buff = new StringBuilder(str);
		for (int i = str.length(); i < len; ++i)
			buff.append(fill);
		return buff.toString();
	}

	/**
	 * padStart.
	 *
	 * @param str
	 * @param len
	 * @param fill
	 * @return byte[]
	 */
	static byte[] padStart(byte[] str, int len, byte fill) {
		if (str.length > len)
			return subbyte(str, 0, len);

		byte[] buff = new byte[len];
		int pos = fill(buff, 0, len, fill, len - str.length);
		copy(buff, pos, len, str, 0, str.length);
		return buff;
	}

	/**
	 * padStart.
	 *
	 * @param str
	 * @param len
	 * @param fill
	 * @return String
	 */
	static String padStart(String str, int len, char fill) {
		if (str.length() > len)
			return str.substring(str.length() - len);

		StringBuilder buff = new StringBuilder();
		for (int i = str.length(); i < len; ++i)
			buff.append(fill);
		buff.append(str);
		return buff.toString();
	}

	/**
	 * subbyte.
	 *
	 * バイト配列から抜き出す
	 *
	 * @param str
	 * @param start
	 * @param size
	 * @return
	 */
	static byte[] subbyte(byte[] str, int start, int size) {
		byte[] buff = new byte[size];
		for (int i = 0; i < size; ++i)
			buff[i] = str[start + i];
		return buff;
	}

	/**
	 * BYTES_PER_LINE.
	 */
	static int BYTES_PER_LINE = 8;

	/**
	 * dump.
	 *
	 * @param str
	 * @return
	 */
	static String dump(byte[] str) {
		StringBuilder buff = new StringBuilder();
		buff.append("");

		for (int j = 0; j < str.length; j += BYTES_PER_LINE) {
			buff.append(padStart(Integer.toHexString(j), 4, '0'));
			buff.append(": ");
			for (int i = 0; i < BYTES_PER_LINE; ++i) {
				buff.append(" ");
				buff.append(padStart(Integer.toHexString(str[j + i]), 2, '0'));
			}
			buff.append("\n");
		}

		return buff.toString();
	}

}
