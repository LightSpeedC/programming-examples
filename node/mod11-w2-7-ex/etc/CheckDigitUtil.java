// http://d.hatena.ne.jp/yone098/20071116/1195145892

public class CheckDigitUtil {

    public static void main(String... args) throws Exception {
        assertEquals(2, mod11(123456789));
        assertEquals(1, mod11(987654321));
        assertEquals(6, mod11(4444333999999999L));
    }

    public static void assertEquals(int x, int y) throws Exception {
      if (x == y) return;
      throw new Exception("AssertionError: " + x + " != " + y);
    }

    private static final int MOD11_MAX_WEIGHT = 7;
    private static final int MOD11_MIN_WEIGHT = 2;
    private static final int MOD11_MOD_VALUE = 11;

    public static int mod11(long n) {
        int sum = 0;
        int x = MOD11_MIN_WEIGHT;
        do {
            sum += ((n % 10) * x);
            x = (MOD11_MAX_WEIGHT == x) ? MOD11_MIN_WEIGHT : ++x;
        } while ((n = n / 10) != 0); 
        int mod = sum % MOD11_MOD_VALUE;
        return (mod == 1) ? 0 : MOD11_MOD_VALUE - mod;
    }
}
