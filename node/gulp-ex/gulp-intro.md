gulp入門
====

ES6 (ES2015) Arrow Function, const を使用します。

準備
----

以下のリンクを見よ  
https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md

### 1. gulpをグローバルにインスト

```bash
$ npm i -g gulp-cli
または
$ npm install --global gulp-cli
```

### 2. プロジェクトディレクトリを初期化

```bash
$ mkdir my-proj
$ cd my-proj
$ npm init -y
```

package.jsonを編集


### 3. gulpをローカルにインスト

```bash
$ npm i -D gulp
または
$ npm install --save-dev gulp
```

### 4. gulpfile.jsを作成

```js
const gulp = require('gulp');
const task = gulp.task.bind(gulp);

task('default', () => {
    // デフォルト・タスクをここに記述する
});
```

### 5. gulpを実行

```bash
$ gulp
```

デフォルト・タスクが実行される。
個別のタスクを実行するには以下の様に。

```bash
$ gulp {タスク} {他のタスク}
```


他のドキュメント
-----

gulp.src, gulp.watch, gulp.dest など。  
https://github.com/gulpjs/gulp/blob/master/docs/API.md


### gulp.src(globs[, options])

```js
gulp.src('client/tmpl/*.xxx')
    .pipe(xxx())
    .pipe(gulp.dest('dist/'));
```

```js
gulp.src('client/tmpl/*.xxx')
    .pipe(xxx())
    .pipe(gulp.dest('dist/'));
```

