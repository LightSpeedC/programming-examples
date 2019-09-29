rem ファイル読込みテスト
@pushd %~dp0
node file-read-batch data.json.log
@popd
@if not "%1" == "nopause" pause
