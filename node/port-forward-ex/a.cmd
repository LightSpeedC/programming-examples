@pushd %~dp0
@node -p '\x1b[44m' & cls
node a %*
@popd
@pause
