console.log('main:', require.main === module, module.parent == null);
console.log(module);
console.log();
require('./sub');
