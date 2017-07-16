# [DEPRECATED]

# [electron-mithril-async-file-search](https://github.com/LightSpeedC/electron-mithril-async-file-search#readme)

Async file search tool with electron and mithril.

ElectronとMithrilを使用した、非同期ファイル検索ツール。

Tested Mac and Windows 10.

## PREPARATION / 準備

```bash
git clone https://github.com/LightSpeedC/electron-mithril-async-file-search
cd electron-mithril-async-file-search
npm install
```

## QUICK EXAMPLE / 実行例

You can run with `npm start`. Pass the directory path to search.

`npm start`で起動できます。引数に検索するディレクトリ・パスを渡します。

```bash
npm start /path/to/search
```

```bash
npm start .
npm start ..
npm start ../..
```

## DEPENDENCIES / 依存モジュール

Depends on `aa` with `promise-thunk`, `executor` and `electron`.

Please stay on `electron@1.5`.

## LICENSE

MIT
