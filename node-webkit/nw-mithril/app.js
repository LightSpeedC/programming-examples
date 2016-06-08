process.env.AAA_TARGET_DIR = (process.argv[2] || process.argv[1]).replace('"', '');
require('child_process').exec('nwsdk ' + __dirname);
setTimeout(() => process.exit(), 100);
