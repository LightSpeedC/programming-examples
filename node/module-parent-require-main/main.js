console.log('main:', require.main === module, module.parent == null);
require('./sub');
