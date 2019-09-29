@rem ファイル読込みテスト
@pushd %~dp0
node --max-old-space-size=2048 --expose-gc file-read-async data.json.log
@rem node --max-old-space-size=2048 file-read-async data.json.log %1
@popd
@if not "%1" == "nopause" if not "%2" == "nopause" pause
