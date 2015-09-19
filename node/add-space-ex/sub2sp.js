  inFileName=process.argv[2]
  outFileName=process.argv[3]
  if (!inFileName) return console.log('node sub2sp {in} {out}')
  if (!outFileName) outFileName = inFileName + '.log';
  fs=require('fs')
  lines=fs.readFileSync(inFileName).toString().split('\r\n');
  lines=lines.map(function(line){
    if (line.length < 2) return line;
    if (line.substr(0, 2) === '  ') return line.substr(2);
    return line;
  });
  fs.writeFileSync(outFileName, lines.join('\r\n'));
