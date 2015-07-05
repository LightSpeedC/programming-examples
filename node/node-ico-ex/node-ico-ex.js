fs=require('fs')
lines=fs.readFileSync('node-ico-org.md').toString().split('\r\n')
res=lines.map(function(line){
  if (line.startsWith('https:')) {
    return line + '<br/>\r\n[![NPM](' + line + ')](https://nodei.co/npm/aa/)<br/>';
  }
  else return line;
});
fs.writeFileSync('node-ico.md', res.join('\r\n'))
