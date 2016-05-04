var logSymbols = require('log-symbols');
 
console.log(logSymbols.success, 'finished successfully!');
// On real OSes:  ✔ finished successfully! 
// On Windows:    √ finished successfully! 

console.log(logSymbols.info, 'finished info!');
console.log(logSymbols.warning, 'finished warning!');
console.log(logSymbols.error, 'finished error!');

// √ finished successfully!
// i finished info!
// ‼ finished warning!
// × finished error!
