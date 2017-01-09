c10k-socket
==

PC 1台で同時接続数 64,000に対応した話 - C10K問題へのNode.jsによる解決方法
--

C10K問題は既にご存知の事と思います。

クライアント10,000台問題

http://www.hyuki.com/yukiwiki/wiki.cgi?TheC10kProblem

http://www.atmarkit.co.jp/news/analysis/200701/09/c10k.html

今や、TCPのポート番号の最大数が制限となるC64Kだ。

短命なポート
[https://ja.wikipedia.org/wiki/エフェメラルポート](https://ja.wikipedia.org/wiki/エフェメラルポート)

C64K: PC 1台で同時接続数6万4千くらいまで対応できそうだ。
