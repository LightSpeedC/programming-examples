# es6-check

|機能                   |node|chrome|chrome canary|firefox|edge|ie11| x   |
|-----------------------|----|-----|-------------|--------|----|----|-----|
|Map                    | o  | o   | o           | o      | o  | o  |poly |
|Set                    | o  | o   | o           | o      | o  | o  |poly |
|WeakMap                | o  | o   | o           | o      | o  | o  |poly |
|WeakSet                | o  | o   | o           | o      | o  | x  |poly |
|const                  | o  | o   | o           | o      | o  | o  |syn  |
|Promise                | o  | o   | o           | o      | o  | x  |poly |
|generators (yield)     | o  | o   | o           | o      | o  | x  |syn  |
|arrow function (=>)    | o  | o   | o           | o      | o  | x  |syn  |
|rest parameters (...)  | △  | o   | o           | o      | o  | x  |syn  |
|default parameters (=) | △  | x   | o           | o      | o  | x  |syn  |
|let                    | o  | o   | o           | x      | o  | o  |syn  |

## ie11

```
info: o: Map enabled
info: o: const enabled
error: x: generators/yield disabled: SyntaxError: '(' がありません。
error: x: arrow function disabled: SyntaxError: 構文エラーです。
error: x: variable parameters/rest parameters disabled: SyntaxError: 識別子がありません。
error: x: defult parameters disabled: SyntaxError: ')' がありません。
info: o: let enabled
```


## chrome

```
info: o: Map enabled
info: o: const enabled
info: o: generators/yield enabled
info: o: arrow function enabled
info: o: variable parameters/rest parameters enabled
error: x: defult parameters disabled: SyntaxError: Unexpected token =
info: o: let enabled
```

## chrome canary

```
info: o: Map enabled
info: o: const enabled
info: o: generators/yield enabled
info: o: arrow function enabled
info: o: variable parameters/rest parameters enabled
info: o: defult parameters enabled
info: o: let enabled
```

## firefox

```
info: o: Map enabled
info: o: const enabled
info: o: generators/yield enabled
info: o: arrow function enabled
info: o: variable parameters/rest parameters enabled
info: o: defult parameters enabled
error: x: let disabled: SyntaxError: let is a reserved identifier
```