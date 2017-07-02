# npm-intro

## npm とは

npm とは node package manager だ。

JavaScriptを使う上で必要となるライブラリは必ずnpmにある。

+ [package.json の 仕様 (日本語) - Blog](https://garafu.blogspot.jp/2016/11/packagejson-specification-ja.html)

+ [what is npm? - npm](https://docs.npmjs.com/getting-started/what-is-npm)

以下の形式でパッケージはダウンロードできる

<https://registry.npmjs.org/npm/-/{パッケージ}-{バージョン}.tgz>

## Node.js と npm のインストール

まずは Node.js をインストしろ。
npmも一緒に入っている。

## package.json

+ "name"
  + すべて小文字
  + 1ワード、スペースなし
  + ダッシュとアンダースコアを許可

+ "version"
  + x.x.x 形式
  + SEMVERスペックに従う

```json:package.json
{
  "name"： "my-awesome-package",
  "version"： "1.0.0"
}
```

`$ npm init` または `$ npm init -y` で作成する。

npm publish する気が無いなら private: true にしておく。

```bash
npm set init.author.email "wombat@npmjs.com"
npm set init.author.name "ag_dubs"
npm set init.license "MIT"
```


### パッケージの指定

プロジェクトが依存するパッケージを指定するには、package.jsonファイルに使用するパッケージをリストアップする必要があります。リストできるパッケージには2種類あります：

+ "dependencies"
  + これらのパッケージは、本番環境でアプリケーションによって必要とされます
+ "devDependencies"
  + これらのパッケージは開発とテストのためにのみ必要です

追加は `npm install パッケージ名 --save` または `--save-dev`

省略形では `npm i パッケージ名 -S` または `-D`

### パッケージの更新・アップデート

更新は `npm update`

テストは `npm outdated`

### パッケージの削除・アンインストール

`npm uninstall パッケージ名 --save`

### グローバル(使用しないほうが良い)

インスト先 `$ npm config get prefix`

```log
C:\Users\YourName\AppData\Roaming\npm
```

インストール `npm install パッケージ名 -g`

更新 `npm update パッケージ名 -g`

アンインストール `npm uninstall パッケージ名 -g`

## パッケージの作成と公開

### パッケージの作成

新規ディレクトリで `mkdir 新規ディレクトリ`

`npm init -y` で package.json を作成

index.js

```js
exports.yourModule = function () {
  console.log('your module');
}
```

test.js


### パッケージの公開

#### アカウントの作成

<http://npmjs.com> でアカウントを作成する

<http://npmjs.com/~> で確認

#### 公開

`npm publish`

#### 更新

バージョンを更新

`npm version patch`
`npm version minor`
`npm version major`

公開

`npm publish`

## SEMVER

+ patch パッチリリース

  + バグの修正とその他のマイナーな変更：最後の数値を増やします（例：1.0.1）。
  + 使う側は 1.0 または 1.0.x または~1.0.4

+ minor マイナーリリース

  + 既存の機能を破らない新しい機能：中間の番号を増やす、たとえば 1.1.0
  + 使う側は 1 または 1.x または ^1.0.4

+ major メジャーリリース

  + 下位互換性を壊す変更：最初の数字を増やします、例えば 2.0.0
  + 使う側は * または x

## スコープ付きパッケージ

@スコープ/プロジェクト名

`npm init --scope=スコープ`

`npm publish --access=public

## タグ付きパッケージ

`npm dist-tag add pkg@ver tag`

`npm publish --tag beta`

`npm install pkg@beta`
