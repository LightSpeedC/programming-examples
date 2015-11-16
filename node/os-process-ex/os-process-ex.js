'use strict';

var os = require('os');

console.log('os.EOL:                   ', JSON.stringify(os.EOL));
console.log('os.tmpdir():              ', os.tmpdir());
console.log('os.endianness():          ', os.endianness());
console.log('os.hostname():            ', os.hostname());
process.env.HOSTNAME &&
console.log('process.env.HOSTNAME:     ', process.env.HOSTNAME);
process.env.COMPUTERNAME &&
console.log('process.env.COMPUTERNAME: ', process.env.COMPUTERNAME);
console.log('os.type():                ', os.type());
console.log('os.platform():            ', os.platform());
console.log('process.platform:         ', process.platform);
console.log('os.arch():                ', os.arch());
console.log('process.arch:             ', process.arch);
console.log('os.release():             ', os.release());
console.log('os.uptime():              ', os.uptime());
console.log('os.loadavg():             ', os.loadavg());
console.log('os.totalmem():            ', os.totalmem(), ' (' + (os.totalmem()/1024/1024/1024).toFixed(3) + ' G)');
console.log('os.freemem():             ', os.freemem(),  ' (' + (os.freemem() /1024/1024/1024).toFixed(3) + ' G)');
//console.log('os.cpus():', os.cpus());
//console.log('os.networkInterfaces():', os.networkInterfaces());
console.log('process.execPath:         ', process.execPath);
console.log('process.execArgv:         ', process.execArgv);
process.getgid &&
console.log('process.getgid():         ', process.getgid());
process.getuid &&
console.log('process.getuid():         ', process.getuid());
console.log('process.version:          ', process.version);
//console.log('process.versions:         ', process.versions);
console.log('process.pid:              ', process.pid);
console.log('process.title:            ', process.title);
console.log('process.memoryUsage():    ', process.memoryUsage());
console.log('process.uptime():         ', process.uptime());
console.log('process.hrtime():         ', process.hrtime(), ' [ seconds, nano-seconds ]');
