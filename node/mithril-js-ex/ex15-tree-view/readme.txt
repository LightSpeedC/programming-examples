階層化されたJSONをHTMLで表示する

 readme.txt                  - このファイル


Mithrilライブラリ v0.2.0 (新しくしても動くと思います)
 mithril.min.js              - これだけが必要
 mithril.js                  - Debug用のソース
 mithril.min.js.map          - Debug用のMap
 mithril.ie.polyfill.min.js  - IEの場合、これも必要
 mithril.ie.polyfill.js      - Debug用のソース


スクリプト
 web-server-here.cmd         - Webサーバ起動用(Python2用)
 web-client-tree.cmd         - Webクライアント起動用
 localhost-8000-xml-show.url - Webクライアント起動用のショートカット


ソース
 json-show.html              - メインHTML
 json-show.js                - メインJavaScript (Mithril用コンポーネント)
 console-component.js        - console.logを表示 (Mithril用コンポーネント)

データ
 data-json.json              - 表示したいJSONファイル
 sample-xml.xml              - 無関係なXMLサンプル
