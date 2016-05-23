package com.lightspeedworks.file;

public class BufferUtil {

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
	 * padEnd. padRight. 左寄せ。右にパディング。
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
	 * padEnd. padRight. 左寄せ。右にパディング。
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
	 * padStart. padLeft. 右寄せ。左にパディング。
	 *
	 * @param str
	 * @param len
	 * @param fill
	 * @return byte[]
	 */
	static byte[] padStart(byte[] str, int len, byte fill) {
		if (str.length > len)
			return subbyte(str, str.length - len, len);

		byte[] buff = new byte[len];
		int pos = fill(buff, 0, len, fill, len - str.length);
		copy(buff, pos, len, str, 0, str.length);
		return buff;
	}

	/**
	 * padStart. padLeft. 右寄せ。左にパディング。
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
	 * BYTES_PER_LINE. 1行当たりのバイト数
	 */
	static int BYTES_PER_LINE = 16; // 1行当たりのバイト数

	/**
	 * dump. ダンプ
	 *
	 * @param str
	 * @return String
	 */
	static String dump(byte[] str) {
		StringBuilder buff = new StringBuilder();
		buff.append("");

		for (int j = 0; j < str.length; j += BYTES_PER_LINE) {
			buff.append(padStart(Integer.toHexString(j), 4, '0'));
			buff.append(":");
			StringBuilder buff1 = new StringBuilder();
			StringBuilder buff2 = new StringBuilder();
			for (int i = 0; i < BYTES_PER_LINE; ++i) {
				if (j + i >= str.length)
					break;
				if (i % 8 == 0)
					buff1.append(" ");
				buff1.append(" ");
				buff1.append(padStart(Integer.toHexString(str[j + i]), 2, '0'));
				if (str[j + i] >= 0x20 && str[j + i] <= 0x7e)
					buff2.append(new Character((char) str[j + i]));
				else
					buff2.append('*');
			}
			buff.append(padEnd(buff1.toString(), BYTES_PER_LINE * 3 + 5, ' '));
			buff.append(buff2);
			buff.append("\n");
		}

		return buff.toString();
	}

}
