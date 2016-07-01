pushd %~dp0
node tree-list.js tree-list.log
@popd
@if not "%paused%" == "paused" (pause & set paused=paused)
