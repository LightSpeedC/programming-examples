s='';i=process.stdin
.on('readable',b=>(b=i.read())?s+=b:0)
.on('end',()=>console.log(JSON.stringify(JSON.parse(s),null,'\t')))
