@call run tsc --target es5 --outFile gtor-es5.js gtor.ts
@call run tsc --target es6 --outFile gtor-es6.js gtor.ts
@node -e "process.stdout.write('\x1b[mnode gtor-es5\r\n\x1b[36m')"
@node gtor-es5
@node -e "process.stdout.write('\x1b[mnode gtor-es6\r\n\x1b[36m')"
@node gtor-es6
@node -e "process.stdout.write('\x1b[mnode gtor.ts\r\n\x1b[36m')"
@node gtor.ts
@node -e "process.stdout.write('\x1b[m')"
