process.env.AAA = process.argv.join(' ');
require('child_process').exec('nwsdk .')
