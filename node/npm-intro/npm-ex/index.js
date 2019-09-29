Object.keys(process.env)
    .filter(x => x.startsWith('npm') && process.env[x] !== '')
    .map(x => x + '=' + process.env[x])
    .forEach(x => console.log(x));
